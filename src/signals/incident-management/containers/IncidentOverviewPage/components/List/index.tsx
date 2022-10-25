// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import parseISO from 'date-fns/parseISO'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { getListIconByKey } from 'shared/services/list-helpers/list-helpers'
import AddressDisplay from 'signals/incident-management/components/AddressDisplay/AddressDisplay'
import { statusList } from 'signals/incident-management/definitions'

import { string2date, string2time } from 'shared/services/string-parser'
import type { Priority } from 'signals/incident-management/definitions/types'
import type { IncidentListItem, IncidentList } from 'types/api/incident-list'
import { INCIDENT_URL } from 'signals/incident-management/routes'

import { StyledList, StyledIcon } from './styles'

export const getDaysOpen = (incident: IncidentListItem) => {
  const statusesWithoutDaysOpen = statusList
    .filter(
      ({ shows_remaining_sla_days }) => shows_remaining_sla_days === false
    )
    .map(({ key }) => key)
  const hasDaysOpen =
    incident.status && !statusesWithoutDaysOpen.includes(incident.status.state)

  const createdAtDate = parseISO(incident.created_at)

  if (!hasDaysOpen || isNaN(createdAtDate.getTime())) return '-'

  return differenceInCalendarDays(new Date(), createdAtDate)
}

interface ListProps {
  className?: string
  incidents: IncidentList
  isLoading?: boolean
  priority: Priority[]
}

const SignalContainer = styled.div`
  display: flex;
  border-top: 2px solid grey;
  font-size: 0.8rem;

  &:last-child {
    border-bottom: 2px solid grey;
  }
  a {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 5px 0;
    color: inherit;
  }
`

const SignalImage = styled.div`
  flex: 0 1 25%;
  min-height: 100px;
  background: gray;
  border: 10px solid white;
`

const SignalInfo = styled.div`
  flex: 1;
  h2 {
    margin: 4px 0 0;

    span {
      display: inline;
    }
  }
  div {
    display: flex;
    justify-items: space-between;

    > span {
      flex: 1;

      &: last-child {
        text-align: right;
      }
    }
  }

  .text-light {
    color: gray;
  }
`

const List: FunctionComponent<ListProps> = ({
  className,
  incidents,
  isLoading = false,
  priority,
}) => {
  const history = useHistory()

  const navigateToIncident = (id: number) => {
    history.push(`${INCIDENT_URL}/${id}`)
  }

  return (
    <StyledList
      isLoading={isLoading}
      className={className}
      data-testid="incidentOverviewListComponent"
    >
      <div>
        {incidents.map((incident) => {
          const detailLink = `/manage/incident/${incident.id}`
          const address = incident.location?.address

          return (
            <SignalContainer
              key={incident.id}
              tabIndex={0}
              onKeyPress={() => navigateToIncident(incident.id)}
            >
              {address && (
                <>
                  <SignalImage>
                    <Link to={detailLink} tabIndex={-1}>
                      image
                    </Link>
                  </SignalImage>
                  <SignalInfo>
                    <Link to={detailLink} tabIndex={-1}>
                      <h2>
                        <StyledIcon>
                          {getListIconByKey(
                            priority,
                            incident.priority?.priority
                          )}
                        </StyledIcon>{' '}
                        <AddressDisplay
                          streetName={address.openbare_ruimte}
                          streetNumber={address.huisnummer}
                          suffix={address.huisletter}
                          etage={address.huisnummer_toevoeging}
                        />
                      </h2>
                      <span className="category">
                        {incident.category?.sub} -{' '}
                        {incident.status?.state_display}
                      </span>
                      <div>
                        <span className="text-light">{incident.id}</span>
                        <span className="text-light">
                          {string2date(incident.created_at)}{' '}
                          {string2time(incident.created_at)}
                        </span>
                      </div>
                    </Link>
                  </SignalInfo>
                </>
              )}
            </SignalContainer>
          )
        })}
      </div>
    </StyledList>
  )
}

export default List
