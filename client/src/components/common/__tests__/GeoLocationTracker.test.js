import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { GeoLocationTracker } from '../GeoLocationTracker';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

global.navigator.geolocation = mockGeolocation;

describe('GeoLocationTracker', () => {
  it('renders without crashing', () => {
    // GeoLocationTracker is likely a functional component that doesn't render visible DOM,
    // or renders a small indicator. We just test that it mounts without crashing.
    const { container } = renderWithProviders(<GeoLocationTracker />);
    expect(container).toBeInTheDocument();
  });
});
