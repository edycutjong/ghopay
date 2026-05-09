import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayrollActions } from './PayrollActions';

vi.mock('@/lib/cloak', () => ({
  cloakService: {
    executeStealthBatch: vi.fn().mockResolvedValue({
      txHash: 'mockTxHash',
      results: [
        { recipient: 'Alice', amount: '5,000 USDC', stealthAddress: 'stealthAddr1' },
      ],
    }),
    generateViewingKey: vi.fn().mockResolvedValue('cloak_vk_mockkey'),
    init: vi.fn().mockResolvedValue(undefined),
    isLive: false,
  },
}));

const baseEmployees = [
  { id: 'EMP-01', name: 'Alice', role: 'Smart Contract Engineer', amount: '5,000 USDC', status: 'Pending' },
];

describe('PayrollActions', () => {
  let onSuccess: Mock;
  let setIsExecuting: Mock;

  beforeEach(() => {
    onSuccess = vi.fn();
    setIsExecuting = vi.fn();
  });

  it('renders the Execute Stealth Batch button', () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('Execute Stealth Batch')).toBeInTheDocument();
  });

  it('renders the Generate Viewing Key button', () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('Generate Viewing Key')).toBeInTheDocument();
  });

  it('shows processing label while executing', () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={true}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('Processing via Cloak SDK...')).toBeInTheDocument();
  });

  it('calls setIsExecuting on execute button click', async () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    fireEvent.click(screen.getByText('Execute Stealth Batch'));
    expect(setIsExecuting).toHaveBeenCalledWith(true);
  });

  it('calls onSuccess after successful batch execution', async () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    fireEvent.click(screen.getByText('Execute Stealth Batch'));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ stealthAddress: 'stealthAddr1' })]),
      'mockTxHash'
    );
  });

  it('shows viewing key after Generate Viewing Key click', async () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    fireEvent.click(screen.getByText('Generate Viewing Key'));
    await waitFor(() => expect(screen.getByText('cloak_vk_mockkey')).toBeInTheDocument());
  });

  it('shows HR Compliance section', () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('HR Compliance')).toBeInTheDocument();
  });

  it('shows fund source info', () => {
    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText('140,500 USDC')).toBeInTheDocument();
  });

  it('shows an alert when stealth batch execution fails', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Override the mock for this specific test
    const { cloakService } = await import('@/lib/cloak');
    (cloakService.executeStealthBatch as Mock).mockRejectedValueOnce(new Error('Failed!'));

    render(
      <PayrollActions
        employees={baseEmployees}
        isExecuting={false}
        setIsExecuting={setIsExecuting}
        onSuccess={onSuccess}
      />
    );
    fireEvent.click(screen.getByText('Execute Stealth Batch'));
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Stealth batch execution failed.');
    });
    
    alertMock.mockRestore();
    consoleMock.mockRestore();
  });
});
