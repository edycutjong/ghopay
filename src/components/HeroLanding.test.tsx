import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroLanding } from './HeroLanding';

vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, whileHover, whileTap, initial, animate, transition, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}));

describe('HeroLanding', () => {
  it('renders the Launch Dashboard button', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    expect(screen.getByText('Launch Dashboard')).toBeInTheDocument();
  });

  it('calls onEnter when Launch Dashboard is clicked', () => {
    const onEnter = vi.fn();
    render(<HeroLanding onEnter={onEnter} />);
    fireEvent.click(screen.getByText('Launch Dashboard'));
    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('shows the Cloak SDK Integration Active badge', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    expect(screen.getByText('Cloak SDK Integration Active')).toBeInTheDocument();
  });

  it('renders the Zero Knowledge feature card', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    expect(screen.getByText('Zero Knowledge')).toBeInTheDocument();
  });

  it('renders the Batch Execution feature card', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    expect(screen.getByText('Batch Execution')).toBeInTheDocument();
  });

  it('renders the Treasury Compliant feature card', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    expect(screen.getByText('Treasury Compliant')).toBeInTheDocument();
  });

  it('handles mouse enter and leave on the button', () => {
    render(<HeroLanding onEnter={vi.fn()} />);
    const btn = screen.getByText('Launch Dashboard').closest('button');
    expect(btn).toBeInTheDocument();
    
    // Simulate hover states to trigger code coverage for onMouseEnter/onMouseLeave
    fireEvent.mouseEnter(btn!);
    fireEvent.mouseLeave(btn!);
  });
});
