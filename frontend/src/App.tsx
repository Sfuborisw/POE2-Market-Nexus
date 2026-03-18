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

import ArbitrageCalculator from "./components/ArbitrageCalculator";
import CurrencySelect from "./components/CurrencySelect";

// Simulation
const data = [
  { time: "00:00 Feb 22", rate: 298 },
  { time: "12:00 Feb 23", rate: 287 },
  { time: "00:00 Feb 24", rate: 295 },
  { time: "12:00 Feb 25", rate: 280 },
];

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
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

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/currencies")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend 傳過嚟嘅資料:", data);
        setCurrencies(data);
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);

  return (
    <div className="flex h-screen bg-[#0f1117] text-slate-200 font-sans overflow-hidden">
      {/* --- 1. Sidebar (Dynamic Width) --- */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 border-r border-slate-800/60 p-6 flex flex-col bg-[#161922] select-none overflow-y-auto"
      >
        <div className="flex items-center gap-2 text-white mb-8">
          <Gem className="text-blue-400" />
          <span className="font-bold text-lg tracking-tight">Navigation</span>
        </div>

        <div className="mb-8">
          <CurrencySelect
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelect={(currency) => setSelectedCurrency(currency)}
          />
        </div>

        <ArbitrageCalculator />
      </aside>

      {/* --- 2. Resizable Divider (The Resizer Handle) --- */}
      <div
        onMouseDown={startResizing}
        className="w-2 flex justify-center cursor-col-resize group"
      >
        <div
          className={`w-[1px] h-full transition-colors ${isResizing ? "bg-blue-400" : "bg-slate-800 group-hover:bg-slate-600"}`}
        />
        <div
          className={`w-[1px] h-full ml-[2px] transition-colors ${isResizing ? "bg-blue-400" : "bg-slate-800 group-hover:bg-slate-600"}`}
        />
      </div>

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
              {/* Dynamic text based on selection */}1 Divine = 286.94{" "}
              {selectedCurrency
                ? selectedCurrency.name.toUpperCase()
                : "EXALTED ORB"}
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
          <StatCard
            label="Gold Fee (per Unit)"
            value={selectedCurrency ? "Loading..." : "120"}
          />
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
