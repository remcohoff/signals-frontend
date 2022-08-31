// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { PanelContent } from 'signals/incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled'
import {
  Checkbox,
  Label,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import configuration from 'shared/services/configuration/configuration'
import { useFetch } from 'hooks'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type Categories from 'types/api/categories'

const StyledPanelContent = styled(PanelContent)`
  padding: ${themeSpacing(10)} ${themeSpacing(5)};
  flex: 0 0 33%;
`

const StyledLabel = styled(Label)`
  font-weight: normal;
`

const CategoryFilter = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(1)} 0;
`

const Wrapper = styled.div`
  border-top: 1px solid ${themeColor('tint', 'level3')};
`

export type FilterCategory = {
  name: string
  _display?: string
  filterActive: boolean
  slug: string
}

type FilterCategoryPanelProps = {
  passFilterCategories: (categories: FilterCategory[]) => void
}

const FilterCategoryPanel: FC<FilterCategoryPanelProps> = ({
  passFilterCategories,
}) => {
  const { get, data } = useFetch<Categories>()
  const [mainCategories, setMainCategories] = useState<FilterCategory[]>()

  const toggleFilter = (categoryName: string) => {
    const updated = mainCategories?.map((category) => {
      if (category.name === categoryName) {
        return {
          ...category,
          filterActive: !category.filterActive,
        }
      } else {
        return category
      }
    })
    setMainCategories(updated)
  }

  useEffect(() => {
    if (!mainCategories) return
    passFilterCategories(mainCategories)
  }, [mainCategories])

  useEffect(() => {
    if (!data) {
      get(configuration.CATEGORIES_ENDPOINT)
    }
  }, [get])

  useEffect(() => {
    if (data) {
      const categories = data.results
        .filter(({ is_public_accessible }) => is_public_accessible)
        .map((category) => ({
          name: category.name,
          _display: category._display,
          filterActive: true,
          slug: category.slug,
        }))

      setMainCategories(categories)
    }
  }, [data])

  return (
    <StyledPanelContent>
      <Paragraph>
        Op deze kaart staan meldingen in de openbare ruimte waarmee we aan het
        werk zijn. Vanwege privacy staat een klein deel van de meldingen niet op
        de kaart.
      </Paragraph>
      {mainCategories && (
        <>
          <Paragraph>
            <strong>Filter op onderwerp</strong>
          </Paragraph>
          <Wrapper>
            {mainCategories?.map(({ name, filterActive, _display }) => {
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
      )}
    </StyledPanelContent>
  )
}

export default FilterCategoryPanel
