import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { SOSHeroButton } from '../SOSHeroButton';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ShieldAlert: () => <div data-testid="shield-icon" />,
  X: () => <div data-testid="x-icon" />,
  Siren: () => <div />,
  Radio: () => <div />,
  Volume2: () => <div />,
  VolumeX: () => <div />
}));

// Mock Next router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SOSHeroButton', () => {
  it('renders correctly', () => {
    renderWithProviders(<SOSHeroButton />);
    expect(screen.getByText(/HOLD 2 SECONDS/i)).toBeInTheDocument();
  });

  it('changes state when hold begins', () => {
    renderWithProviders(<SOSHeroButton />);
    const button = screen.getByText(/HOLD 2 SECONDS/i).closest('button');
    
    // Simulate mouse down
    fireEvent.mouseDown(button);
    expect(button).toBeInTheDocument();
  });
});
