import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Gem } from "lucide-react";

import ArbitrageCalculator from "./ArbitrageCalculator"; // Note on path: because all components are in components/ now
import CurrencySelect from "./CurrencySelect";

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  // --- Resizing Logic (Preserving your original hard work) ---
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

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

  // --- Data States (Connect Backend) ---
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [rawPrices, setRawPrices] = useState<any[]>([]);

  // 1. Fetch Currencies
  useEffect(() => {
    fetch("http://localhost:8000/currencies")
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data);
        if (data.length > 0 && !selectedCurrency) {
          setSelectedCurrency(data[0]);
        }
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);

  // 2. Fetch Price History
  useEffect(() => {
    fetch("http://localhost:8000/prices")
      .then((res) => res.json())
      .then((data) => setRawPrices(data))
      .catch((err) => console.error("Error fetching prices:", err));
  }, []);

  // 3. Filter and Format Chart Data
  const chartData = useMemo(() => {
    if (!selectedCurrency || rawPrices.length === 0) return [];

    // Find all quotes belonging to the selected currency, then sort them by time from oldest to newest
    const filtered = rawPrices.filter(
      (p) => p.item_name === selectedCurrency.name,
    );
    const sorted = filtered.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return sorted.map((p) => {
      const date = new Date(p.timestamp);
      const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} ${date.toLocaleString("en-US", { month: "short", day: "numeric" })}`;
      return { time: timeString, rate: p.price_value };
    });
  }, [rawPrices, selectedCurrency]);

  // 4. Dynamically calculate Stat Card values (latest price, price movement)
  const latestData =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const previousData =
    chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const currentRateStr = latestData ? latestData.rate.toFixed(5) : "---";

  let moveText = "---";
  let subMoveText = "";
  let moveColor = "text-slate-400";

  if (latestData && previousData) {
    const diff = latestData.rate - previousData.rate;
    if (diff > 0) {
      moveText = `+${diff.toFixed(5)}`;
      subMoveText = `↑ ${diff.toFixed(6)}`;
      moveColor = "text-green-400";
    } else if (diff < 0) {
      moveText = `${diff.toFixed(5)}`;
      subMoveText = `↓ ${Math.abs(diff).toFixed(6)}`;
      moveColor = "text-red-400";
    } else {
      moveText = "0.00000";
      moveColor = "text-slate-400";
    }
  }

  // --- UI Render ---
  return (
    <div className="flex h-screen bg-[#0f1117] text-slate-200 font-sans overflow-hidden">
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
        <ArbitrageCalculator currencies={currencies} />
      </aside>

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

      <main className="flex-grow overflow-y-auto p-10 bg-[#0f1117]">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gem className="text-blue-400" size={32} /> POE2 Market Pro
            Analytics
          </h1>
        </header>

        <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 mb-8">
          <div className="flex items-end gap-4 mb-6">
            <span className="text-5xl font-black text-white">
              1 {selectedCurrency ? selectedCurrency.name.toUpperCase() : "---"}{" "}
              = {currentRateStr} DIVINE
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
          <StatCard label="Latest Rate (Divine)" value={currentRateStr} />
          <StatCard
            label="Last Move"
            value={moveText}
            subValue={subMoveText}
            color={moveColor}
          />
          <StatCard
            label="Gold Fee (per Unit)"
            value={
              selectedCurrency
                ? selectedCurrency.gold_cost.toLocaleString()
                : "---"
            }
          />
          <StatCard
            label="Gold for 100 Units"
            value={
              selectedCurrency
                ? (selectedCurrency.gold_cost * 100).toLocaleString()
                : "---"
            }
          />
        </div>
      </main>
    </div>
  );
}

// Sub-component StatCard, placed at the end of the same file
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
        <div className={`text-[10px] mt-1 font-bold ${color}`}>{subValue}</div>
      )}
    </div>
  );
}
