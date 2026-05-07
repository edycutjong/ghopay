"use client";

import React, { useState } from 'react';
import { umbraService } from '@/lib/umbra';

export function PayrollActions() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [viewingKey, setViewingKey] = useState<string | null>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    await umbraService.executeStealthBatch([]);
    setIsExecuting(false);
    alert('Stealth batch executed successfully.');
  };

  const handleGenerateViewingKey = async () => {
    const key = await umbraService.generateViewingKey();
    setViewingKey(key);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h3 className="text-slate-100 font-semibold mb-4 tracking-wide">Cloak Protocol Setup</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Fund Source</div>
            <div className="flex justify-between items-center font-mono text-sm text-slate-300">
              <span>Treasury Wallet (Multi-sig)</span>
              <span className="text-cyan-400">140,500 USDC</span>
            </div>
          </div>
          
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Payroll</div>
            <div className="flex justify-between items-center font-mono text-lg text-slate-200">
              <span>3 Transactions</span>
              <span className="text-white">13,300 USDC</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {isExecuting ? 'Executing...' : 'Execute Stealth Batch'}
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            Powered by Cloak SDK
          </p>
        </div>
      </div>
      
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h3 className="text-slate-100 font-semibold mb-2 tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Generate Viewing Key
        </button>
        {viewingKey && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg break-all text-xs font-mono text-cyan-400">
            {viewingKey}
          </div>
        )}
      </div>
    </div>
  );
}
