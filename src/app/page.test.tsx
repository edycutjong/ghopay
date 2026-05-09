import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './page';

vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div: ({ children, whileHover, whileTap, initial, animate, transition, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/lib/cloak', () => ({
  cloakService: {
    executeStealthBatch: vi.fn().mockResolvedValue({ 
      txHash: 'hash', 
      results: [
        { stealthAddress: 'addr1' },
        { stealthAddress: 'addr2' },
        { stealthAddress: 'addr3' }
      ] 
    }),
    generateViewingKey: vi.fn().mockResolvedValue('cloak_vk_key'),
  },
}));

describe('Home page', () => {
  it('shows HeroLanding initially', () => {
    render(<Home />);
    expect(screen.getByText('Launch Dashboard')).toBeInTheDocument();
  });

  it('does not show the HR Dashboard header initially', () => {
    render(<Home />);
    expect(screen.queryByText('HR Dashboard')).not.toBeInTheDocument();
  });

  it('shows the HR Dashboard after clicking Launch Dashboard', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Launch Dashboard'));
    expect(screen.getByText('HR Dashboard')).toBeInTheDocument();
  });

  it('displays all three employees in the dashboard', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Launch Dashboard'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('shows Ghopay branding in the dashboard header', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Launch Dashboard'));
    // There will be multiple Ghopay text nodes — at least one in the header
    const nodes = screen.getAllByText('Ghopay');
    expect(nodes.length).toBeGreaterThanOrEqual(1);
  });

  it('updates employee status on successful stealth batch execution', async () => {
    const { waitFor } = await import('@testing-library/react');
    render(<Home />);
    fireEvent.click(screen.getByText('Launch Dashboard'));
    
    // Ensure mock results match employee indices
    // Mock is already set in the vi.mock
    
    const executeBtn = screen.getByText('Execute Stealth Batch');
    fireEvent.click(executeBtn);
    
    await waitFor(() => {
      expect(screen.queryAllByText('Executed (Stealth)').length).toBe(3);
    });
  });
});
