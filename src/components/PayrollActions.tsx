import React, { useState } from 'react';
import { cloakService } from '@/lib/cloak';
import { ScrambleText } from './WowEffects';

interface Employee {
  id: string;
  name: string;
  role: string;
  amount: string;
  status: string;
}

interface PayrollActionsProps {
  employees: Employee[];
  isExecuting: boolean;
  setIsExecuting: (val: boolean) => void;
  onSuccess: (results: any[], txHash: string) => void;
}

export function PayrollActions({ employees, isExecuting, setIsExecuting, onSuccess }: PayrollActionsProps) {
  const [viewingKey, setViewingKey] = useState<string | null>(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Convert current employees into transaction format
    const transactions = employees.map(emp => ({
      recipient: emp.name,
      amount: emp.amount
    }));

    try {
      const { txHash, results } = await cloakService.executeStealthBatch(transactions);
      onSuccess(results, txHash);
    } catch (error) {
      console.error(error);
      alert('Stealth batch execution failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGenerateViewingKey = async () => {
    setIsGeneratingKey(true);
    const key = await cloakService.generateViewingKey();
    setViewingKey(key);
    setIsGeneratingKey(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {isExecuting && (
          <div className="absolute inset-0 bg-cyan-500/5 z-0 animate-pulse"></div>
        )}
        <h3 className="text-slate-100 font-semibold mb-4 tracking-wide relative z-10">Cloak Protocol Setup</h3>
        
        <div className="space-y-4 relative z-10">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Fund Source</div>
            <div className="flex justify-between items-center font-mono text-sm text-slate-300">
              <span>Treasury Wallet (Multi-sig)</span>
              <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]">140,500 USDC</span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Payroll</div>
            <div className="flex justify-between items-center font-mono text-lg text-slate-200">
              <span>{employees.length} Transactions</span>
              <span className="text-white">13,300 USDC</span>
            </div>
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <button 
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all flex justify-center items-center gap-2 group relative overflow-hidden"
          >
            {isExecuting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] animate-[shimmer_1.5s_infinite]"></div>
            )}
            <svg className={`w-5 h-5 ${isExecuting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isExecuting ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              )}
            </svg>
            {isExecuting ? 'Processing via Cloak SDK...' : 'Execute Stealth Batch'}
          </button>
          <p className="text-center text-xs text-slate-500 mt-3 font-mono">
            Powered by Cloak Protocol (Solana)
          </p>
        </div>
      </div>
      
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-slate-100 font-semibold mb-2 tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          HR Compliance
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Generate viewing keys for auditors or compliance officers without exposing on-chain data to the public.
        </p>
        <button 
          onClick={handleGenerateViewingKey}
          disabled={isGeneratingKey}
          className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium py-2 px-4 rounded-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGeneratingKey ? 'Generating...' : 'Generate Viewing Key'}
        </button>
        {viewingKey && (
          <div className="mt-4 p-3 bg-slate-950/80 border border-emerald-500/30 rounded-lg break-all text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative">
            <ScrambleText text={viewingKey} trigger={true} duration={2500} />
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10 pointer-events-none rounded-lg animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}
