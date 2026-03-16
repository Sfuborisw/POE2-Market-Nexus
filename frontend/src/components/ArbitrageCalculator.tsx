import React, { useState } from "react";
import { Calculator, ArrowRight, Coins } from "lucide-react";

export default function ArbitrageCalculator() {
  // Align with Excel parameters
  const [initialD, setInitialD] = useState<number>(10);
  const [deRatio, setDeRatio] = useState<number>(370); // D -> E
  const [eaRatio, setEaRatio] = useState<number>(1415); // E -> A
  const [adRatio, setAdRatio] = useState<number>(0.22222); // A -> D

  // Fixed Gold Fee
  const GOLD_FEE_PER_UNIT = 100;

  // Calculation process
  const amountE = initialD * deRatio;
  const amountA = amountE / eaRatio; // Reference Excel F4 logic
  const finalD = amountA * adRatio;

  const profitD = finalD - initialD;
  const profitPercent = (profitD / initialD) * 100;

  // Gold Fee Calculation
  const totalGoldFee = (amountE + amountA) * GOLD_FEE_PER_UNIT;

  return (
    <div className="mt-auto p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-inner">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-5 text-white">
        <Calculator size={18} className="text-blue-400" /> Arbitrage Pro (3-Way)
      </h3>

      <div className="space-y-4">
        {/* Step 1: D -> E */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-bold text-slate-500">
            Initial Divine (D)
          </label>
          <input
            type="number"
            value={initialD}
            onChange={(e) => setInitialD(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>

        {/* Ratios Input Grid */}
        <div className="grid grid-cols-3 gap-2">
          <RatioInput label="D/E" value={deRatio} onChange={setDeRatio} />
          <RatioInput label="E/A" value={eaRatio} onChange={setEaRatio} />
          <RatioInput label="A/D" value={adRatio} onChange={setAdRatio} />
        </div>

        {/* Flow Preview */}
        <div className="flex items-center justify-between py-2 px-3 bg-slate-900/50 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400">
          <span>{initialD}D</span>
          <ArrowRight size={10} />
          <span>{amountE.toFixed(0)}E</span>
          <ArrowRight size={10} />
          <span>{amountA.toFixed(2)}A</span>
          <ArrowRight size={10} />
          <span className="text-blue-400">{finalD.toFixed(3)}D</span>
        </div>

        {/* Result & Gold Fee */}
        <div
          className={`p-4 rounded-xl border transition-all ${profitD >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
        >
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                Net Profit
              </div>
              <div
                className={`text-2xl font-black ${profitD >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {profitD >= 0 ? "+" : ""}
                {profitD.toFixed(3)} <span className="text-xs">D</span>
              </div>
            </div>
            <div
              className={`text-sm font-bold ${profitD >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {profitPercent.toFixed(1)}%
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/30 flex justify-between items-center text-[10px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Coins size={12} /> Total Fee:
            </span>
            <span className="text-slate-300 font-mono">
              {totalGoldFee.toLocaleString()} Gold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatioInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-[9px] font-bold text-slate-600 block mb-1 text-center">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[11px] text-center text-blue-300"
      />
    </div>
  );
}
