// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import MapInputComponent from 'components/MapInput'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import configuration from 'shared/services/configuration/configuration'
import { formatMapLocation } from 'shared/services/map-location'

import Label from 'components/Label'

export const MapInput = (props) => {
  const { name, display, onQueryResult, value: valueFromProps } = props

  const value = formatMapLocation(valueFromProps)
  const defaultCenter =
    configuration.map.optionsBackOffice?.center || MAP_OPTIONS.center

  const center = value?.coordinates || defaultCenter

  const mapOptions = {
    ...MAP_OPTIONS,
    ...(configuration.map.optionsBackOffice || {}),
    center,
    zoom: 14,
  }

  const onLocationChange = (location) => {
    onQueryResult(location)
  }

  return (
    <div className="map-input">
      <div className="mode_input map rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        <div className="map-input__control invoer">
          <MapInputComponent
            id="map-input"
            value={value}
            onChange={onLocationChange}
            mapOptions={mapOptions}
            hasZoomControls
          />
        </div>
      </div>
    </div>
  )
}

export default MapInput
