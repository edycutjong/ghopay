import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechStack } from './TechStack';

describe('TechStack', () => {
  const badges = ['Next.js 16', 'React 19', 'Tailwind v4', 'Solana'];

  it.each(badges)('renders %s badge', (name) => {
    render(<TechStack />);
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders four badges in total', () => {
    render(<TechStack />);
    expect(screen.getAllByRole('generic').filter(el => el.tagName === 'SPAN').length).toBeGreaterThanOrEqual(4);
  });
});
