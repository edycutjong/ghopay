"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, ChevronRight } from "lucide-react";
import { ScrambleText } from "./WowEffects";

interface HeroLandingProps {
  onEnter: () => void;
}

export function HeroLanding({ onEnter }: HeroLandingProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10 overflow-hidden">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full flex flex-col items-center text-center space-y-8"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 text-sm font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Shield className="w-4 h-4" />
          <span>Cloak SDK Integration Active</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] tracking-tight py-2">
          <ScrambleText text="Ghopay" trigger={true} duration={1500} />
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light">
          The ultimate zero-knowledge payroll infrastructure. Execute private batch transactions for your entire DAO without compromising treasury transparency.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={onEnter}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group overflow-hidden bg-cyan-500 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Zap className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110 text-white' : ''}`} />
              <span className="relative z-10">Launch Dashboard</span>
              <ChevronRight className={`relative z-10 w-5 h-5 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16"
        >
          {[
            { icon: Lock, title: "Zero Knowledge", desc: "Payments hidden from public explorers via advanced stealth addresses." },
            { icon: Zap, title: "Batch Execution", desc: "Distribute 1,000+ payments in a single transaction to save on gas fees." },
            { icon: Shield, title: "Treasury Compliant", desc: "Maintain overall DAO accounting while keeping individual salaries private." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl text-left hover:border-cyan-500/50 transition-colors duration-300 group">
              <feature.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
