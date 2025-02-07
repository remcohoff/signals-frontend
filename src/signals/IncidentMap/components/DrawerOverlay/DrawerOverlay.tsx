// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { CSSProperties, FunctionComponent } from 'react'
import { useCallback } from 'react'

import { Icon } from '@remcohoff/asc-ui'

import type { Incident } from '../../types'
import { DetailPanel } from './DetailPanel'
import {
  Drawer,
  DrawerContainer,
  DrawerContent,
  DrawerContentWrapper,
  DrawerHandleDesktop,
  DrawerHandleMiniDesktop,
  DrawerHandleMobile,
  DrawerMapOverlay,
  HandleIcon,
} from './styled'
import { DrawerState } from './types'
import { isMobile, isDesktop, useDeviceMode } from './utils'

const CONTROLS_PADDING = 32

export interface Props {
  incident?: Incident
  onCloseDetailPanel: () => void
  onStateChange?: (state: DrawerState) => void
  state?: DrawerState
}

export const DrawerOverlay: FunctionComponent<Props> = ({
  children,
  incident,
  onCloseDetailPanel,
  onStateChange,
  state = DrawerState.Closed,
}) => {
  const mode = useDeviceMode()
  const DrawerHandle = isMobile(mode) ? DrawerHandleMobile : DrawerHandleDesktop

  function getDrawerPositionTransform(drawerState = state) {
    if (drawerState !== DrawerState.Open && !isMobile(mode)) {
      return `translateX(calc(-100% + 19px))`
    }

    if (drawerState !== DrawerState.Open && isMobile(mode)) {
      return `translateY(calc(100% - 40px))`
    }

    return ''
  }

  const drawerContainerStyle: CSSProperties = {}
  const drawerContentStyle: CSSProperties = {}

  drawerContainerStyle.transform = getDrawerPositionTransform()

  const drawerClick = useCallback(() => {
    onStateChange &&
      onStateChange(
        state === DrawerState.Closed ? DrawerState.Open : DrawerState.Closed
      )
  }, [onStateChange, state])

  return (
    <DrawerMapOverlay $mode={mode}>
      <DrawerContainer $mode={mode} style={drawerContainerStyle} animate={true}>
        <Drawer $mode={mode}>
          <DrawerHandle
            type="button"
            variant="blank"
            size={CONTROLS_PADDING}
            title="Toggle paneel"
            aria-label={
              state === DrawerState.Open ? 'Paneel sluiten' : 'Paneel openen'
            }
            onClick={drawerClick}
          >
            {isDesktop(mode) ? (
              <DrawerHandleMiniDesktop>
                <Icon size={20}>
                  <HandleIcon $isOpen={state === DrawerState.Open} />
                </Icon>
              </DrawerHandleMiniDesktop>
            ) : null}
          </DrawerHandle>

          {incident && (
            <DetailPanel onClose={onCloseDetailPanel} incident={incident} />
          )}

          <DrawerContent style={drawerContentStyle} data-testid="drawerContent">
            <DrawerContentWrapper>{children}</DrawerContentWrapper>
          </DrawerContent>
        </Drawer>
      </DrawerContainer>
    </DrawerMapOverlay>
  )
}
