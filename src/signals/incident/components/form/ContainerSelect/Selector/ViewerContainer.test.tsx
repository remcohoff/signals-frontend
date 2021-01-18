import React from 'react';
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import { MapPanelProvider } from '@amsterdam/arm-core';

import ViewerContainer from './ViewerContainer';

describe('ViewerContainer', () => {
  const button = <button type="button">Legend</button>;

  it('should render mobile variant of viewer container', () => {
    render(withAppContext(
      <MapPanelProvider
        variant="drawer"
        initialPosition={SnapPoint.Closed}
      >
        <ViewerContainer id="viewer-container" legendButton={button} showDesktopVariant={false} />
      </MapPanelProvider>
    ));

    const viewerContainer = screen.getByTestId('viewer-container');
    expect(viewerContainer).toHaveStyle('left: 0px');
    expect(viewerContainer).toHaveStyle('height: calc(100% - 70px)');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render desktop variant of viewer container', () => {
    render(withAppContext(
      <MapPanelProvider
        variant="drawer"
        initialPosition={SnapPoint.Closed}
      >
        <ViewerContainer id="viewer-container" legendButton={button} showDesktopVariant />
      </MapPanelProvider>
    ));

    const viewerContainer = screen.getByTestId('viewer-container');
    expect(viewerContainer).toHaveStyle('left: calc(100% - 70px)');
    expect(viewerContainer).toHaveStyle('height: 100%');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
