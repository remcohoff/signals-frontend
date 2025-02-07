// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import StatusLayer from '../../Asset/Selector/StatusLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature } from '../../types'
import { getFeatureStatusType } from '../../Asset/Selector/StatusLayer/utils'

export const ClockLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const featureStatusTypes = meta.featureStatusTypes || []
  const statusFeatures =
    data.features.filter(
      (feature) =>
        getFeatureStatusType(feature, featureStatusTypes) !== undefined
    ) || []

  return (
    <>
      <AssetLayer />
      {statusFeatures.length > 0 && featureStatusTypes && (
        <StatusLayer
          statusFeatures={statusFeatures as Feature[]}
          featureStatusTypes={featureStatusTypes}
        />
      )}
    </>
  )
}

export default ClockLayer
