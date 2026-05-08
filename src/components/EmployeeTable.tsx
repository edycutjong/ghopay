import React from 'react';
import { ScrambleText } from './WowEffects';

interface Employee {
  id: string;
  name: string;
  role: string;
  amount: string;
  status: string;
  stealthAddress: string | null;
}

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-slate-900/80 to-transparent">
        <h3 className="text-slate-100 font-semibold tracking-wide flex items-center gap-2">
          March 2026 Payroll Run
        </h3>
        <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          {employees.length} Employees
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/40 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-cyan-500/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">{emp.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{emp.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-400 text-sm">{emp.role}</div>
                  {emp.stealthAddress && (
                    <div className="text-[10px] text-cyan-500/70 font-mono mt-1 flex flex-col">
                      <span>Dest:</span>
                      <ScrambleText text={emp.stealthAddress} trigger={!!emp.stealthAddress} duration={2000 + Math.random() * 1000} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-cyan-400 font-mono text-sm drop-shadow-[0_0_5px_rgba(6,182,212,0.3)]">{emp.amount}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-xs px-2.5 py-1.5 rounded-md border font-medium ${
                    emp.status.includes('Executed') 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/50'
                  }`}>
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
