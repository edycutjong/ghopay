import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('shows SYSTEM ONLINE', () => {
    render(<StatusBar />);
    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument();
  });

  it('shows version v1.0.0', () => {
    render(<StatusBar />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('shows latency value', () => {
    render(<StatusBar />);
    expect(screen.getByText('12ms')).toBeInTheDocument();
  });

  it('shows uptime value', () => {
    render(<StatusBar />);
    expect(screen.getByText('99.9%')).toBeInTheDocument();
  });
});
