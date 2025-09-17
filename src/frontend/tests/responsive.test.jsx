import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Dashboard from '../src/components/Dashboard';

describe('Responsive Design', () => {
  it('renders dashboard on mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    render(<Dashboard />);
    // The component should render without errors on mobile
    expect(true).toBe(true);
  });

  it('renders dashboard on tablet viewport', () => {
    // Mock tablet viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    render(<Dashboard />);
    // The component should render without errors on tablet
    expect(true).toBe(true);
  });

  it('renders dashboard on desktop viewport', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    render(<Dashboard />);
    // The component should render without errors on desktop
    expect(true).toBe(true);
  });
});