import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LayoutDashboard,
  TrendingUp,
  Calculator,
  Settings,
  Gem,
} from "lucide-react";

// Simulation
const data = [
  { time: "00:00 Feb 22", rate: 298 },
  { time: "12:00 Feb 23", rate: 287 },
  { time: "00:00 Feb 24", rate: 295 },
  { time: "12:00 Feb 25", rate: 280 },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0f1117] text-slate-200 font-sans">
      {/* 1. Sidebar - Navigation */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8 bg-[#161922]">
        <div className="flex items-center gap-2 text-white">
          <Gem className="text-blue-400" />
          <span className="font-bold text-lg tracking-tight">Navigation</span>
        </div>

        <nav className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Select Currency
          </div>
          <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm">
            <option>exalted</option>
          </select>
        </nav>

        {/* Arbitrage Calculator */}
        <div className="mt-auto p-4 rounded-xl bg-slate-800/30 border border-slate-700">
          <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
            <TrendingUp size={16} className="text-green-400" /> Arbitrage
            Calculator
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Investment</span> <span className="text-white">10.00</span>
            </div>
            <div className="p-2 mt-2 rounded bg-green-500/10 text-green-400 font-bold text-center">
              Profit: 309.9%
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-grow overflow-y-auto p-10">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gem className="text-blue-400" size={32} /> POE2 Market Pro
            Analytics
          </h1>
          <button className="text-xs text-slate-400 hover:text-white transition-colors">
            Deploy
          </button>
        </header>

        {/* 3. Hero Stats - 1 Divine = 286.94 EXALTED */}
        <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 mb-8">
          <div className="flex items-end gap-4 mb-6">
            <span className="text-5xl font-black text-white">
              1 Divine = 286.94 EXALTED
            </span>
          </div>

          {/* Chart Section */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#4ade80" }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#4ade80"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#4ade80", strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Bottom Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard label="Latest Rate" value="286.9440" />
          <StatCard
            label="Last Move"
            value="1.4744"
            subValue="↑ 1.474448"
            color="text-green-400"
          />
          <StatCard label="Gold Fee (per Unit)" value="120" />
          <StatCard label="Gold for 100 Units" value="12,000" />
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800">
      <div className="text-xs font-bold text-slate-500 uppercase mb-2">
        {label}
      </div>
      <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
      {subValue && (
        <div className="text-[10px] mt-1 text-green-500 font-bold">
          {subValue}
        </div>
      )}
    </div>
  );
}
