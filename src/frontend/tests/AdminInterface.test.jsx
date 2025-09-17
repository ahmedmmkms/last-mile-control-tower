import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminInterface from '../src/components/AdminInterface';

describe('AdminInterface', () => {
  it('renders the admin interface title', () => {
    render(<AdminInterface />);
    expect(screen.getByText('Admin Interface')).toBeInTheDocument();
  });

  it('renders tab navigation', () => {
    render(<AdminInterface />);
    expect(screen.getByText('Shipments')).toBeInTheDocument();
    expect(screen.getByText('Drivers')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
  });
});