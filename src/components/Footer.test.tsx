import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the project attribution text', () => {
    render(<Footer />);
    expect(screen.getByText(/SilentPayroll/)).toBeInTheDocument();
  });

  it('mentions the hackathon', () => {
    render(<Footer />);
    expect(screen.getByText(/Colosseum Frontier Hackathon 2026/)).toBeInTheDocument();
  });

  it('renders a footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
