import React from 'react';

export function EmployeeTable() {
  const employees = [
    { id: 'EMP-01', name: 'Alice', role: 'Smart Contract Engineer', amount: '5,000 USDC', status: 'Pending' },
    { id: 'EMP-02', name: 'Bob', role: 'Frontend Developer', amount: '4,500 USDC', status: 'Pending' },
    { id: 'EMP-03', name: 'Charlie', role: 'Designer', amount: '3,800 USDC', status: 'Pending' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-slate-100 font-semibold tracking-wide">March 2026 Payroll Run</h3>
        <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/20">
          3 Employees
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-200">{emp.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{emp.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{emp.role}</td>
                <td className="px-6 py-4 text-cyan-400 font-mono text-sm">{emp.amount}</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-slate-500 text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700">
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
