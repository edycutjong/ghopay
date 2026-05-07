import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      <div className="w-full space-y-8">
        <Link href="/" className="text-xs font-mono text-cyan-500 hover:underline">
          ← Back to Dashboard
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">Ghopay</h1>
          <p className="text-lg text-slate-400">Private Batch Payroll</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 tracking-wider">WHAT IT DOES</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            DAO payroll system using Cloak SDK for confidential salary distribution with treasury transparency.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 tracking-wider">TECH STACK</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js 16", "React 19", "Tailwind v4", "TypeScript", "Solana"].map((t) => (
              <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-cyan-400">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 tracking-wider">HACKATHON</h2>
          <p className="text-sm text-slate-400">
            Built for <span className="text-white font-semibold">Colosseum Frontier Hackathon 2026</span>.
            Solo developer submission focusing on deep SDK integration and production-ready UX.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Launch Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}
