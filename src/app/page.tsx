import { EmployeeTable } from "@/components/EmployeeTable";
import { PayrollActions } from "@/components/PayrollActions";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-cyan-500">Ghopay</span>
            <span className="text-slate-600 font-light">|</span>
            <span className="text-lg text-slate-400 font-normal">HR Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Private batch payroll via Cloak SDK</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            CONNECTED: 0x9f...3aB
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EmployeeTable />
        </div>
        <div className="lg:col-span-1">
          <PayrollActions />
        </div>
      </div>

      <section className="pt-8 text-center text-slate-500 text-sm">
        <p>Ghopay protects employee salary privacy while ensuring DAO treasury accountability.</p>
      </section>
    </main>
  );
}
