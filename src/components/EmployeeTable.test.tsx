import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmployeeTable } from './EmployeeTable';

const baseEmployees = [
  { id: 'EMP-01', name: 'Alice', role: 'Smart Contract Engineer', amount: '5,000 USDC', status: 'Pending', stealthAddress: null },
  { id: 'EMP-02', name: 'Bob', role: 'Frontend Developer', amount: '4,500 USDC', status: 'Pending', stealthAddress: null },
];

describe('EmployeeTable', () => {
  it('renders each employee name', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders each employee role', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('Smart Contract Engineer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('renders each employee amount', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('5,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('4,500 USDC')).toBeInTheDocument();
  });

  it('renders employee IDs', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('EMP-01')).toBeInTheDocument();
    expect(screen.getByText('EMP-02')).toBeInTheDocument();
  });

  it('shows correct employee count badge', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('2 Employees')).toBeInTheDocument();
  });

  it('renders Pending status badges', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    const badges = screen.getAllByText('Pending');
    expect(badges).toHaveLength(2);
  });

  it('renders Executed status badge when status includes Executed', () => {
    const executed = [{ ...baseEmployees[0], status: 'Executed (Stealth)', stealthAddress: 'abc123xyz' }];
    render(<EmployeeTable employees={executed} />);
    expect(screen.getByText('Executed (Stealth)')).toBeInTheDocument();
  });

  it('shows stealth address destination label when stealthAddress is set', () => {
    const withStealth = [{ ...baseEmployees[0], stealthAddress: 'SomeBase58Address44chars00000000000000000000' }];
    render(<EmployeeTable employees={withStealth} />);
    expect(screen.getByText('Dest:')).toBeInTheDocument();
  });

  it('renders empty table body when employees list is empty', () => {
    render(<EmployeeTable employees={[]} />);
    expect(screen.getByText('0 Employees')).toBeInTheDocument();
  });

  it('renders the payroll run header', () => {
    render(<EmployeeTable employees={baseEmployees} />);
    expect(screen.getByText('March 2026 Payroll Run')).toBeInTheDocument();
  });
});
