// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect } from 'react'

import { Checkbox, Heading } from '@remcohoff/asc-ui'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import type { Filter } from '../../types'
import { updateFilterCategory } from '../utils'
import { StyledLabel, CategoryFilter, Wrapper } from './styled'
import { getFilterCategoriesWithIcons } from './utils'

export interface Props {
  filters: Filter[]
  setFilters: (categories: Filter[]) => void
  setMapMessage: (mapMessage: JSX.Element | string) => void
}

export const FilterPanel = ({ filters, setFilters, setMapMessage }: Props) => {
  const { get, data, error } = useFetch<Categories>()

  const toggleFilter = (categoryName: string) => {
    const updated = updateFilterCategory(categoryName, filters)

    setFilters(updated)
  }

  useEffect(() => {
    if (filters.length === 0) {
      get(configuration.CATEGORIES_ENDPOINT)
    }
  }, [filters, get])

  useEffect(() => {
    if (data?.results) {
      const filters: Filter[] = getFilterCategoriesWithIcons(data.results)

      setFilters(filters)
    }
  }, [data, setFilters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen filter categorieën worden opgehaald.')
    }
  }, [error, setMapMessage])

  if (filters.length === 0) {
    return null
  }

  return (
    <>
      <Heading as="h4">Filter op onderwerp</Heading>
      <Wrapper>
        {filters.map(({ name, filterActive, _display }) => {
          return (
            <CategoryFilter key={name}>
              <StyledLabel htmlFor={name} label={_display || name}>
                <Checkbox
                  id={name}
                  checked={filterActive}
                  onChange={() => toggleFilter(name)}
                />
              </StyledLabel>
            </CategoryFilter>
          )
        })}
      </Wrapper>
    </>
  )
}
