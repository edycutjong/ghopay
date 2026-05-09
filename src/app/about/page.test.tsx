import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => <a href={href} {...rest}>{children}</a>,
}));

describe('AboutPage', () => {
  it('renders the Ghopay heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'Ghopay' })).toBeInTheDocument();
  });

  it('mentions Private Batch Payroll', () => {
    render(<AboutPage />);
    expect(screen.getByText('Private Batch Payroll')).toBeInTheDocument();
  });

  it('shows the tech stack section', () => {
    render(<AboutPage />);
    expect(screen.getByText('TECH STACK')).toBeInTheDocument();
  });

  it('lists key technologies', () => {
    render(<AboutPage />);
    expect(screen.getByText('Next.js 16')).toBeInTheDocument();
    expect(screen.getByText('Solana')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('shows the hackathon section', () => {
    render(<AboutPage />);
    expect(screen.getByText('HACKATHON')).toBeInTheDocument();
    expect(screen.getByText('Colosseum Frontier Hackathon 2026')).toBeInTheDocument();
  });

  it('has a back to dashboard link', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Back to Dashboard/)).toBeInTheDocument();
  });

  it('has a Launch Dashboard link', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Launch Dashboard/)).toBeInTheDocument();
  });
});
