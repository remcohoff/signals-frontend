// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import { capitalize } from 'shared/services/date-utils'
import nl from 'date-fns/locale/nl'

import type { Incident } from 'types/incident'
import type { FC } from 'react'

interface DateTimeProps {
  value: number
  incident?: Incident
}

const getValue = (value: number, incident?: Incident) => {
  if (!incident) {
    return ''
  }

  const today = new Date()
  const datetime = new Date(value)

  const daysAreEqual = today.getDate() === datetime.getDate()
  const monthsAreEqual = today.getMonth() === datetime.getMonth()
  const yearsAreEqual = today.getFullYear() === datetime.getFullYear()
  const isToday = daysAreEqual && monthsAreEqual && yearsAreEqual

  if (isToday) {
    return format(value, "'Vandaag', HH:mm", { locale: nl })
  }

  return `${capitalize(format(value, 'EEEE d MMMM, HH:mm', { locale: nl }))}`
}

const DateTime: FC<DateTimeProps> = ({ value, incident }) => (
  <span>{getValue(value, incident)}</span>
)

export default DateTime
