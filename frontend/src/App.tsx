import { useState, useEffect, useCallback } from "react";
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

function ArbitrageCalculator() {
  const [investment, setInvestment] = useState<number>(10);
  const [buyRate, setBuyRate] = useState<number>(280); // Buy at 280
  const [sellRate, setSellRate] = useState<number>(286.94); // Sell at 286.94
  const [goldFee, setGoldFee] = useState<number>(120); // Fee per unit

  // Calculation Logic
  const totalCost = investment * buyRate + investment * goldFee;
  const totalRevenue = investment * sellRate;
  const profit = totalRevenue - totalCost;
  const profitPercentage = (profit / totalCost) * 100;

  return (
    <div className="mt-auto p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-4 text-white">
        <Calculator size={18} className="text-blue-400" /> Arbitrage Calculator
      </h3>

      <div className="space-y-4">
        {/* Input: Investment */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Investment (Units)
          </label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500">BUY @</span>{" "}
            <span className="text-white">{buyRate}</span>
          </div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-500">SELL @</span>{" "}
            <span className="text-white">{sellRate}</span>
          </div>
        </div>

        {/* Profit Display */}
        <div
          className={`p-3 rounded-xl border ${profit >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"} transition-colors`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Est. Profit
            </span>
            <TrendingUp
              size={14}
              className={profit >= 0 ? "text-green-400" : "text-red-400"}
            />
          </div>
          <div
            className={`text-xl font-black ${profit >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
            <span className="text-[10px]">GOLD</span>
          </div>
          <div
            className={`text-[11px] font-bold mt-1 ${profit >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {profit >= 0 ? "↑" : "↓"} {profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // 1. Set Sidebar width state (initial 256px is the original w-64)
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  // 2. Resizing logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        // Limit width range: min 200px, max 1000px
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth > 200 && newWidth < 1000) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex h-screen bg-[#0f1117] text-slate-200 font-sans overflow-hidden">
      {/* --- 1. Sidebar (Dynamic Width) --- */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 border-r border-slate-800/60 p-6 flex flex-col bg-[#161922] select-none"
      >
        <div className="flex items-center gap-2 text-white mb-8">
          <Gem className="text-blue-400" />
          <span className="font-bold text-lg tracking-tight">Navigation</span>
        </div>

        <nav className="space-y-4 mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Select Currency
          </div>
          <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500">
            <option>exalted</option>
          </select>
        </nav>

        <ArbitrageCalculator />
      </aside>

      {/* --- 2. Resizable Divider (The Resizer Handle) --- */}
      <div
        onMouseDown={startResizing}
        className={`w-1 cursor-col-resize transition-colors z-50 ${
          isResizing ? "bg-blue-500" : "bg-transparent hover:bg-blue-500/30"
        }`}
      />

      {/* --- 3. Main Content --- */}
      <main className="flex-grow overflow-y-auto p-10 bg-[#0f1117]">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gem className="text-blue-400" size={32} /> POE2 Market Pro
            Analytics
          </h1>
          <button className="text-xs text-slate-400 hover:text-white transition-colors">
            Deploy
          </button>
        </header>

        <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 mb-8">
          <div className="flex items-end gap-4 mb-6">
            <span className="text-5xl font-black text-white">
              1 Divine = 286.94 EXALTED
            </span>
          </div>

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
