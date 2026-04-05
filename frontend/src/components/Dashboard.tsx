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

import ArbitrageCalculator from "./ArbitrageCalculator";
import CurrencySelect from "./CurrencySelect";
import Footer from "./Footer"; // 🌟 1. Import the Footer

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(450); // Adjusted starting width
  const [isResizing, setIsResizing] = useState(false);

  // --- Resizing Logic ---
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth > 200 && newWidth < 1000) setSidebarWidth(newWidth);
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

  // --- Data States ---
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [rawPrices, setRawPrices] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<"DIVINE_TO_ITEM" | "ITEM_TO_DIVINE">(
    "DIVINE_TO_ITEM",
  );

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/currencies`)
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data);
        if (data.length > 0 && !selectedCurrency) {
          setSelectedCurrency(data[0]);
        }
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, [API_BASE_URL]);

  // 2. Fetch Price History
  useEffect(() => {
    if (!selectedCurrency) return;

    fetch(`${API_BASE_URL}/prices?item_id=${selectedCurrency.id}`)
      .then((res) => res.json())
      .then((data) => setRawPrices(data))
      .catch((err) => console.error("Error fetching prices:", err));
  }, [selectedCurrency, API_BASE_URL]);

  // 3. Filter and Format Chart Data
  const chartData = useMemo(() => {
    if (rawPrices.length === 0) return [];

    return rawPrices.map((p) => {
      const date = new Date(p.timestamp);
      const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} ${date.toLocaleString("en-US", { month: "short", day: "numeric" })}`;

      const calculatedRate =
        viewMode === "DIVINE_TO_ITEM" ? 1 / p.price_value : p.price_value;

      return {
        time: timeString,
        rate: calculatedRate,
        raw_price: p.price_value,
      };
    });
  }, [rawPrices, viewMode]);

  // 4. Dynamically calculate Stat Card values
  const latestData =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const previousData =
    chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const decimalPlaces = viewMode === "DIVINE_TO_ITEM" ? 2 : 5;
  const currentRateStr = latestData
    ? latestData.rate.toFixed(decimalPlaces)
    : "---";

  let moveText = "---";
  let subMoveText = "";
  let moveColor = "text-slate-500 dark:text-slate-400";

  if (latestData && previousData) {
    const diff = latestData.rate - previousData.rate;
    if (diff > 0) {
      moveText = `+${diff.toFixed(decimalPlaces)}`;
      subMoveText = `↑ ${diff.toFixed(decimalPlaces + 1)}`;
      moveColor = "text-green-600 dark:text-green-400";
    } else if (diff < 0) {
      moveText = `${diff.toFixed(decimalPlaces)}`;
      subMoveText = `↓ ${Math.abs(diff).toFixed(decimalPlaces + 1)}`;
      moveColor = "text-red-600 dark:text-red-400";
    } else {
      moveText = "0.00";
      moveColor = "text-slate-500 dark:text-slate-400";
    }
  }

  const currencyName = selectedCurrency
    ? selectedCurrency.name.toUpperCase()
    : "---";
  const titleText =
    viewMode === "DIVINE_TO_ITEM"
      ? `1 DIVINE = ${currentRateStr} ${currencyName}`
      : `1 ${currencyName} = ${currentRateStr} DIVINE`;

  // --- UI Render ---
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f1117] text-slate-900 dark:text-slate-200 font-sans overflow-hidden transition-colors duration-300">
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 border-r border-slate-200 dark:border-slate-800/60 p-6 flex flex-col bg-white dark:bg-[#161922] select-none overflow-y-auto transition-colors duration-300"
      >
        <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-8">
          <Gem className="text-blue-500 dark:text-blue-400" />
          <span className="font-bold text-lg tracking-tight">Navigation</span>
        </div>
        <div className="mb-8">
          <CurrencySelect
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onSelect={setSelectedCurrency}
          />
        </div>
        <ArbitrageCalculator currencies={currencies} />
      </aside>

      <div
        onMouseDown={startResizing}
        className="w-2 flex justify-center cursor-col-resize group"
      >
        <div
          className={`w-[1px] h-full transition-colors ${isResizing ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-800 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"}`}
        />
        <div
          className={`w-[1px] h-full ml-[2px] transition-colors ${isResizing ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-800 group-hover:bg-slate-400 dark:group-hover:bg-slate-600"}`}
        />
      </div>

      <main className="flex-grow flex flex-col overflow-y-auto bg-slate-50 dark:bg-[#0f1117] transition-colors duration-300">
        <div className="flex-grow p-10">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <Gem className="text-blue-500 dark:text-blue-400" size={32} />{" "}
              POE2 Market Pro Analytics
            </h1>

            {/* 🌟 View Mode Toggle Button */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1 transition-colors duration-300 shadow-sm dark:shadow-none">
              <button
                onClick={() => setViewMode("DIVINE_TO_ITEM")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "DIVINE_TO_ITEM" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                1 Divine ➔ X Item
              </button>
              <button
                onClick={() => setViewMode("ITEM_TO_DIVINE")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "ITEM_TO_DIVINE" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                1 Item ➔ X Divine
              </button>
            </div>
          </header>

          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 mb-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {titleText}
              </span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                    itemStyle={{ color: "#4ade80", fontWeight: "bold" }}
                    formatter={(value: number) => [
                      value.toFixed(decimalPlaces),
                      "Rate",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "#4ade80", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <StatCard label="Latest Rate" value={currentRateStr} />
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
        </div>

        <Footer />
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  color = "text-slate-900 dark:text-white", // Default to dark text in light mode, white in dark mode
}: {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors duration-300">
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
