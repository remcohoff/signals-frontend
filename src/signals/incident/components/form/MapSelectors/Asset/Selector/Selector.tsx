// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react'
import ReactDOM from 'react-dom'
import { Marker } from '@amsterdam/react-maps'
import { MapPanel, MapPanelDrawer, MapPanelProvider } from '@amsterdam/arm-core'
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants'
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'

import type { FunctionComponent, ReactElement } from 'react'
import type {
  MapOptions,
  LeafletMouseEvent,
  Marker as MarkerType,
  Map as MapType,
  LatLngTuple,
  LatLngLiteral,
} from 'leaflet'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'
import type { PdokResponse } from 'shared/services/map-location'
import type { LocationResult } from 'types/location'

import { formatAddress } from 'shared/services/format-address'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { markerIcon } from 'shared/services/configuration/map-markers'
import configuration from 'shared/services/configuration/configuration'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import MapCloseButton from 'components/MapCloseButton'
import GPSButton from 'components/GPSButton'

import LocationMarker from 'components/LocationMarker'
import { selectionIsUndetermined, UNREGISTERED_TYPE } from '../../constants'
import { MapMessage, ZoomMessage } from '../../components/MapMessage'
import LegendToggleButton from './LegendToggleButton'
import LegendPanel from './LegendPanel'
import AssetLayer from './WfsLayer/AssetLayer'
import WfsLayer from './WfsLayer'
import SelectionPanel from './SelectionPanel'
import {
  ControlWrapper,
  StyledMap,
  StyledPDOKAutoSuggest,
  StyledViewerContainer,
  TopLeftWrapper,
  Wrapper,
} from './styled'

const MAP_PANEL_DRAWER_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '90%',
  [SnapPoint.Halfway]: '50%',
  [SnapPoint.Full]: '0',
}
const MAP_PANEL_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '30px',
  [SnapPoint.Halfway]: '400px',
  [SnapPoint.Full]: '100%',
}

const MAP_CONTAINER_ZOOM_LEVEL: ZoomLevel = {
  max: 13,
}

const MAP_LOCATION_ZOOM = 14
const MAP_NO_LOCATION_ZOOM = 9

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const {
    address,
    close,
    coordinates,
    layer,
    meta,
    selection,
    setLocation,
    fetchLocation,
  } = useContext(AssetSelectContext)
  const [desktopView] = useMatchMedia({ minBreakpoint: 'laptop' })
  const { Panel, panelVariant } = useMemo<{
    Panel: FunctionComponent
    panelVariant: Variant
  }>(
    () =>
      desktopView
        ? { Panel: MapPanel, panelVariant: 'panel' }
        : { Panel: MapPanelDrawer, panelVariant: 'drawer' },
    [desktopView]
  )
  const center =
    coordinates || (configuration.map.options.center as LatLngTuple)

  const mapOptions: MapOptions = useMemo(
    () => ({
      ...MAP_OPTIONS,
      center,
      dragging: true,
      zoomControl: false,
      minZoom: 7,
      maxZoom: 16,
      zoom: coordinates ? MAP_LOCATION_ZOOM : MAP_NO_LOCATION_ZOOM,
    }),
    [center, coordinates]
  )

  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [pinMarker, setPinMarker] = useState<MarkerType>()
  const [map, setMap] = useState<MapType>()
  const [geolocation, setGeolocation] = useState<LocationResult>()
  const addressValue = address ? formatAddress(address) : ''
  const hasFeatureTypes = meta.featureTypes.length > 0

  const showMarker =
    coordinates && (!selection || selectionIsUndetermined(selection))

  const mapClick = useCallback(
    ({ latlng }: LeafletMouseEvent) => {
      fetchLocation(latlng)
    },
    [fetchLocation]
  )

  const toggleLegend = useCallback(() => {
    setShowLegendPanel(!showLegendPanel)
  }, [showLegendPanel])

  const handleLegendCloseButton = () => {
    setShowLegendPanel(false)
  }

  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      const { location, address } = option.data
      setLocation({ coordinates: location, address })

      map?.flyTo(option.data.location, MAP_LOCATION_ZOOM)
    },
    [setLocation, map]
  )

  const Layer = layer || AssetLayer

  useEffect(() => {
    if (!map || !pinMarker || !coordinates || selection) return

    pinMarker.setLatLng(coordinates)
  }, [map, coordinates, pinMarker, selection])

  useLayoutEffect(() => {
    if (!map || !geolocation) return

    map.flyTo(
      [geolocation.latitude, geolocation.longitude] as LatLngTuple,
      16,
      {
        animate: true,
        noMoveStart: true,
      }
    )
  }, [geolocation, map])

  const mapWrapper = (
    <Wrapper data-testid="assetSelectSelector">
      <MapPanelProvider
        mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
        mapPanelDrawerSnapPositions={MAP_PANEL_DRAWER_SNAP_POSITIONS}
        variant={panelVariant}
        initialPosition={SnapPoint.Halfway}
      >
        <StyledMap
          hasZoomControls={desktopView}
          mapOptions={mapOptions}
          events={{ click: mapClick }}
          setInstance={setMap}
          hasGPSControl
        >
          <StyledViewerContainer
            topLeft={
              <TopLeftWrapper>
                <ControlWrapper>
                  <GPSButton
                    onLocationSuccess={(location: LocationResult) => {
                      const { latitude, longitude } = location
                      const coordinates = {
                        lat: latitude,
                        lng: longitude,
                      } as LatLngLiteral

                      setLocation({ coordinates })
                      setGeolocation(location)
                    }}
                    onLocationError={() => {
                      setMapMessage(
                        <>
                          <strong>
                            {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                          </strong>
                          <p>
                            Dit kunt u wijzigen in de voorkeuren of instellingen
                            van uw browser of systeem.
                          </p>
                        </>
                      )
                    }}
                    onLocationOutOfBounds={() => {
                      setMapMessage(
                        'Uw locatie valt buiten de kaart en is daardoor niet te zien'
                      )
                    }}
                  />
                  <StyledPDOKAutoSuggest
                    onSelect={onAddressSelect}
                    placeholder="Zoek adres"
                    value={addressValue}
                  />
                </ControlWrapper>

                {hasFeatureTypes && (
                  <ZoomMessage
                    data-testid="zoomMessage"
                    zoomLevel={MAP_CONTAINER_ZOOM_LEVEL}
                  >
                    Zoom in om de{' '}
                    {meta?.language?.objectTypePlural || 'objecten'} te zien
                  </ZoomMessage>
                )}

                {mapMessage && (
                  <MapMessage
                    data-testid="mapMessage"
                    onClick={() => setMapMessage('')}
                  >
                    {mapMessage}
                  </MapMessage>
                )}
              </TopLeftWrapper>
            }
            bottomLeft={
              hasFeatureTypes ? (
                <LegendToggleButton
                  onClick={toggleLegend}
                  isRenderingLegendPanel={showLegendPanel}
                />
              ) : null
            }
            topRight={<MapCloseButton onClick={close} />}
          />

          <Panel data-testid={`panel${desktopView ? 'Desktop' : 'Mobile'}`}>
            <SelectionPanel
              featureTypes={meta.featureTypes}
              language={meta.language}
              variant={panelVariant}
            />

            {showLegendPanel ? (
              <LegendPanel
                onClose={handleLegendCloseButton}
                variant={panelVariant}
                items={meta.featureTypes
                  .filter(({ typeValue }) => typeValue !== UNREGISTERED_TYPE) // Filter the unknown icon from the legend
                  .map((featureType) => ({
                    label: featureType.label,
                    iconUrl: featureType.icon.iconUrl,
                    id: featureType.typeValue,
                  }))}
              />
            ) : null}
          </Panel>

          <WfsLayer zoomLevel={MAP_CONTAINER_ZOOM_LEVEL}>
            <Layer featureTypes={meta.featureTypes} />
          </WfsLayer>

          {geolocation && <LocationMarker geolocation={geolocation} />}

          {showMarker && (
            <span data-testid="assetPinMarker">
              <Marker
                key={Object.values(coordinates).toString()}
                setInstance={setPinMarker}
                args={[coordinates]}
                options={{
                  icon: markerIcon,
                  keyboard: false,
                }}
              />
            </span>
          )}
        </StyledMap>
      </MapPanelProvider>
    </Wrapper>
  )

  return ReactDOM.createPortal(mapWrapper, appHtmlElement)
}

export default Selector
