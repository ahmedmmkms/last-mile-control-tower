import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../src/components/Dashboard';

describe('Dashboard', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Last-Mile Delivery Control Tower')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Shipments')).toBeInTheDocument();
    expect(screen.getByText('Drivers')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});