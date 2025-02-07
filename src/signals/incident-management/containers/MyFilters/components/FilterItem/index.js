// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Heading, Link, themeSpacing, themeColor } from '@remcohoff/asc-ui'
import * as types from 'shared/types'
import {
  parseToAPIData,
  parseOutputFormData,
} from 'signals/shared/filter/parse'
import FilterTagList from 'signals/incident-management/containers/FilterTagList'
import { Checkbox, Label } from '@remcohoff/asc-ui'

import Refresh from '../../../../../../images/icon-refresh.svg'

const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(7)};
`

const StyledH4 = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('secondary')};
  display: block;
`

const StyledLink = styled(Link)`
  margin-right: ${themeSpacing(5)};
  font-size: 16px;
`

const RefreshIcon = styled(Refresh).attrs({
  height: 18,
})`
  color: ${themeColor('secondary')};
  margin-right: ${themeSpacing(2)};
  vertical-align: middle;
  margin-top: -2px;
  cursor: default;
`

const OverviewLabel = styled(Label)`
  display: flex;
  font-weight: 400;
  margin-left: -6px;
`

const FilterItem = ({
  filter,
  onApplyFilter,
  onEditFilter,
  onRemoveFilter,
  onUpdateFilter,
  onClose,
}) => {
  const handleApplyFilter = useCallback(
    (event) => {
      event.preventDefault()

      onApplyFilter(parseToAPIData(filter))

      onClose()
    },
    [filter, onApplyFilter, onClose]
  )

  const handleEditFilter = useCallback(
    (event) => {
      event.preventDefault()

      onEditFilter(parseToAPIData(filter))

      onClose()
    },
    [filter, onEditFilter, onClose]
  )

  const handleRemoveFilter = useCallback(
    (event) => {
      event.preventDefault()

      if (
        global.confirm(
          'Weet je zeker dat je dit filter wilt verwijderen?\nDit kan niet ongedaan worden gemaakt.'
        )
      ) {
        onRemoveFilter(filter.id)
      }
    },
    [filter.id, onRemoveFilter]
  )

  const toggleShowFilterOnOverview = () => {
    onUpdateFilter({
      name: filter.name,
      refresh: filter.refresh,
      id: filter.id,
      options: parseOutputFormData(filter.options),
      show_on_overview: !filter.show_on_overview,
    })
  }

  return (
    <Wrapper className="filter-item">
      <StyledH4 forwardedAs="h4">
        {filter.refresh && <RefreshIcon />}
        {filter.name}
      </StyledH4>

      <FilterTagList tags={filter.options} />

      <StyledLink
        href="/"
        variant="inline"
        onClick={handleApplyFilter}
        data-testid="handleApplyFilterButton"
      >
        Toon resultaat
      </StyledLink>
      <StyledLink
        href="/"
        variant="inline"
        onClick={handleEditFilter}
        data-testid="handleEditFilterButton"
      >
        Wijzig
      </StyledLink>
      <StyledLink
        href="/"
        variant="inline"
        onClick={handleRemoveFilter}
        data-testid="handleRemoveFilterButton"
      >
        Verwijder
      </StyledLink>

      <OverviewLabel label="Toon in het overzicht">
        <Checkbox
          onClick={toggleShowFilterOnOverview}
          checked={filter.show_on_overview}
        />
      </OverviewLabel>
    </Wrapper>
  )
}

FilterItem.propTypes = {
  filter: types.filterType.isRequired,
  onApplyFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onUpdateFilter: PropTypes.func.isRequired,
}

export default FilterItem
