// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Theme } from 'types/theme'
import ParentIncidentIcon from 'components/ParentIncidentIcon'

import { Result } from '../types'
import FeedbackStatus from './FeedbackStatus'

const Info = styled.span`
  font-weight: bold;
  display: flex;
`

const ListItem = styled.li<{ isSelected: boolean; theme: Theme }>`
  display: flex;
  padding: ${themeSpacing(2)};
  padding-right: ${themeSpacing(4)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};

  :hover {
    cursor: pointer;

    ${Info} {
      text-decoration: underline;
      color: ${themeColor('secondary')};
    }
  }

  ${({ isSelected, theme }) =>
    isSelected &&
    `
      background-color: rgba(0,70,153,0.1);
      border-left: 4px solid ${themeColor('primary')({ theme })};
      margin-left: -4px;
    `}
`

const Wrapper = styled.div`
  display: grid;
  grid: auto-flow / 2fr 1fr 1fr;
  grid-gap: ${themeSpacing(1)};
  width: 100%;
`

const StyledParentIncidentIcon = styled(ParentIncidentIcon)`
  padding-top: ${themeSpacing(1)};
  padding-right: ${themeSpacing(1)};
`

const Spacing = styled.div`
  width: ${themeSpacing(6)};
`

const StyledFeedbackStatus = styled(FeedbackStatus)`
  justify-self: end;
`

const DateTime = styled.p`
  margin: 0;
  color: ${themeColor('tint', 'level5')};
`

interface IncidentListItemProps {
  incident: Result
  isSelected: boolean
  onClick: () => void
}

const IncidentListItem: React.FC<IncidentListItemProps> = ({
  incident: { category, feedback, id, status, created_at, has_children },
  isSelected,
  onClick,
}) => (
  <ListItem onClick={onClick} isSelected={isSelected}>
    {has_children ? <StyledParentIncidentIcon /> : <Spacing />}
    <Wrapper>
      <Info>
        {id} {category.sub}
      </Info>
      <span>{status.state_display}</span>
      <StyledFeedbackStatus feedback={feedback} />
      <DateTime>{format(new Date(created_at), 'dd-MM-yyyy HH:mm')}</DateTime>
    </Wrapper>
  </ListItem>
)

export default IncidentListItem
