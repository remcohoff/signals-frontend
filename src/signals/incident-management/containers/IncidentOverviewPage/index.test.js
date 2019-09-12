import React from 'react';
import { mount } from 'enzyme';
import cloneDeep from 'lodash.clonedeep';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import { withAppContext } from 'test/utils';

import IncidentOverviewPage, {
  IncidentOverviewPageContainerComponent,
  mapDispatchToProps,
} from './';
import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';

jest.mock('scroll-lock');

describe.skip('signals/incident-management/containers/IncidentOverviewPage', () => {
  let props;

  beforeEach(() => {
    props = {
      overviewpage: {
        incidents: [],
        loading: false,
        filter: {},
        incidentsCount: 666,
        page: 3,
        priorityList: [],
        stadsdeelList: [],
        statusList: [],
      },
      categories: {},
      onRequestIncidents: jest.fn(),
      onIncidentSelected: jest.fn(),
      onMainCategoryFilterSelectionChanged: jest.fn(),
      baseUrl: '',
    };
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { queryByTestId, rerender, getByText } = render(
      withAppContext(<IncidentOverviewPageContainerComponent {...props} />),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).not.toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).not.toBeNull();
    expect(queryByTestId('loadingIndicator')).toBeNull();

    const loadingProps = cloneDeep(props);
    loadingProps.overviewpage.loading = true;

    rerender(
      withAppContext(
        <IncidentOverviewPageContainerComponent {...loadingProps} />,
      ),
    );

    expect(queryByTestId('incidentOverviewPagerComponent')).toBeNull();
    expect(queryByTestId('incidentOverviewListComponent')).toBeNull();
    expect(queryByTestId('loadingIndicator')).not.toBeNull();

    // filter button
    expect(getByText('Filteren').tagName).toEqual('BUTTON');
  });

  it('should have props from structured selector', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.overviewpage).not.toBeUndefined();
    expect(containerProps.categories).not.toBeUndefined();
    expect(containerProps.loading).not.toBeUndefined();
    expect(containerProps.error).not.toBeUndefined();
  });

  it('should have props from action creator', () => {
    const tree = mount(withAppContext(<IncidentOverviewPage />));

    const containerProps = tree
      .find(IncidentOverviewPageContainerComponent)
      .props();

    expect(containerProps.onIncidentSelected).not.toBeUndefined();
    expect(typeof containerProps.onIncidentSelected).toEqual('function');

    expect(containerProps.onRequestIncidents).not.toBeUndefined();
    expect(typeof containerProps.onRequestIncidents).toEqual('function');
  });

  it('opens modal', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(<IncidentOverviewPage />),
    );

    expect(queryByTestId('modal')).toBeNull();

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();
  });

  it('closes modal on ESC', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(<IncidentOverviewPage />),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();

    fireEvent.keyDown(global.document, { key: 'Esc', keyCode: 27 });

    expect(queryByTestId('modal')).toBeNull();
  });

  it('closes modal by means of close button', () => {
    const { queryByTestId, getByTestId } = render(
      withAppContext(<IncidentOverviewPage />),
    );

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).not.toBeNull();

    fireEvent(
      getByTestId('closeBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(queryByTestId('modal')).toBeNull();
  });

  it('should disable page scroll', () => {
    const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(disablePageScroll).toHaveBeenCalled();
  });

  it('should enable page scroll', () => {
    const { getByTestId } = render(withAppContext(<IncidentOverviewPage />));

    fireEvent(
      getByTestId('modalBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    fireEvent(
      getByTestId('closeBtn'),
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(enablePageScroll).toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request incidents', () => {
      mapDispatchToProps(dispatch).onRequestIncidents({
        filter: {},
        page: 666,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: REQUEST_INCIDENTS,
        payload: { filter: {}, page: 666 },
      });
    });

    it('should select an incident', () => {
      mapDispatchToProps(dispatch).onIncidentSelected({ id: 666 });
      expect(dispatch).toHaveBeenCalledWith({
        type: INCIDENT_SELECTED,
        payload: { id: 666 },
      });
    });
  });
});
