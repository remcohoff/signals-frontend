import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import LocationPreview from './index';

jest.mock('../MapDetail', () => () => <div data-testid="location-preview-map" />);

describe('<LocationPreview />', () => {
  let props;

  beforeEach(() => {
    props = {
      location: {
        extra_properties: null,
        geometrie: {
          type: 'Point',
          coordinates: [
            4.892649650573731,
            52.36918517949316
          ]
        },
        buurt_code: 'A00d',
        created_by: null,
        address: {
          postcode: '1012KP',
          huisletter: 'A',
          huisnummer: '123',
          woonplaats: 'Amsterdam',
          openbare_ruimte: 'Rokin',
          huisnummer_toevoeging: 'H'
        },
        stadsdeel: 'A',
        bag_validated: false,
        address_text: 'Rokin 123-H 1012KP Amsterdam',
        id: 3372
      },
      onEditLocation: jest.fn()
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const { queryByTestId } = render(
        <LocationPreview {...props} />
      );

      expect(queryByTestId('location-preview-button-edit')).toHaveTextContent(/^Locatie wijzigen$/);
      expect(queryByTestId('location-preview-map')).not.toBeNull();
    });
  });

  describe('events', () => {
    it('clicking the edit button should trigger edit the location', () => {
      const { queryByTestId } = render(
        <LocationPreview {...props} />
      );
      fireEvent.click(queryByTestId('location-preview-button-edit'));

      expect(props.onEditLocation).toHaveBeenCalledTimes(1);
    });
  });
});
