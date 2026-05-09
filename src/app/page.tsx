"use client";

import { useState } from "react";
import { EmployeeTable } from "@/components/EmployeeTable";
import { PayrollActions } from "@/components/PayrollActions";
import { ParticleBackground } from "@/components/WowEffects";
import { HeroLanding } from "@/components/HeroLanding";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [employees, setEmployees] = useState<{ id: string; name: string; role: string; amount: string; status: string; stealthAddress: string | null }[]>([
    { id: 'EMP-01', name: 'Alice', role: 'Smart Contract Engineer', amount: '5,000 USDC', status: 'Pending', stealthAddress: null },
    { id: 'EMP-02', name: 'Bob', role: 'Frontend Developer', amount: '4,500 USDC', status: 'Pending', stealthAddress: null },
    { id: 'EMP-03', name: 'Charlie', role: 'Designer', amount: '3,800 USDC', status: 'Pending', stealthAddress: null },
  ]);

  const [isExecuting, setIsExecuting] = useState(false);

  const handleBatchSuccess = (results: { stealthAddress: string }[], txHash: string) => {
    console.log("Batch executed:", txHash);
    setEmployees(prev => prev.map((emp, idx) => ({
      ...emp,
      status: 'Executed (Stealth)',
      stealthAddress: results[idx].stealthAddress
    })));
  };

  return (
    <>
      <ParticleBackground />
      {!showDashboard ? (
        <HeroLanding onEnter={() => setShowDashboard(true)} />
      ) : (
        <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-6xl mx-auto relative z-10 animate-in fade-in duration-1000 slide-in-from-bottom-4">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/50">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Ghopay</span>
                <span className="text-slate-600 font-light">|</span>
                <span className="text-lg text-slate-400 font-normal">HR Dashboard</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Private batch payroll via Cloak SDK</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full text-xs font-mono text-slate-300 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                CONNECTED: <span className="text-cyan-400">0x9f...3aB</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <EmployeeTable employees={employees} />
            </div>
            <div className="lg:col-span-1">
              <PayrollActions 
                employees={employees} 
                isExecuting={isExecuting}
                setIsExecuting={setIsExecuting}
                onSuccess={handleBatchSuccess} 
              />
            </div>
          </div>

          <section className="pt-8 text-center text-slate-500 text-sm">
            <p>Ghopay protects employee salary privacy while ensuring DAO treasury accountability.</p>
          </section>
        </main>
      )}
    </>
  );
}
