// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { Close } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'

import type { FunctionComponent } from 'react'

import IconList, { IconListItem } from 'components/IconList/IconList'
import Button from 'components/Button'

import type { FeatureType, Item } from '../../types'

const StyledButton = styled(Button).attrs(() => ({
  type: 'button',
  variant: 'blank',
  size: 32,
  iconSize: 12,
}))`
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  min-width: auto;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const StyledDiv = styled.div`
  color: ${themeColor('secondary')};
`

const StyledLabel = styled.div`
  margin-left: ${themeSpacing(2)};
`

export interface AssetListProps {
  className?: string
  featureTypes?: FeatureType[]
  onRemove?: () => void
  selection: Item
}

const AssetList: FunctionComponent<AssetListProps> = ({
  onRemove,
  selection,
  className,
  featureTypes,
}) => {
  const { id, type, isReported } = selection
  const { description, icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === type) ?? {}

  const label = [description, id].filter(Boolean).join(' - ')

  if (!id) return null

  return (
    <IconList data-testid="assetList" className={className}>
      <IconListItem
        key={id}
        id={isReported ? `assetListItem-${id}-reported` : `assetListItem-${id}`}
        iconUrl={icon?.iconUrl}
        isReported={isReported}
      >
        <ItemWrapper>
          <StyledLabel>
            {label}
            {isReported && <StyledDiv>Is gemeld</StyledDiv>}
          </StyledLabel>
          {onRemove && (
            <StyledButton
              data-testid={`assetListRemove-${id}`}
              aria-label="Verwijder"
              icon={<Close />}
              onClick={onRemove}
            />
          )}
        </ItemWrapper>
      </IconListItem>
    </IconList>
  )
}

export default AssetList
