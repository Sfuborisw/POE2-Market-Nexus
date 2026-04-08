import { useState, useEffect } from "react";
import { ArrowRight, Calculator, Edit2, Coins, ArrowDown } from "lucide-react";

export default function ArbitrageCalculator({
  currencies,
}: {
  currencies: any[];
}) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [currencyB, setCurrencyB] = useState<string>("exalted");
  const [currencyC, setCurrencyC] = useState<string>("alch");

  const [investment, setInvestment] = useState<number>(10);
  const [rateDB, setRateDB] = useState<number>(370);
  const [rateBC, setRateBC] = useState<number>(1415);
  const [rateCD, setRateCD] = useState<number>(0.22222);

  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/latest-prices`)
      .then((res) => res.json())
      .then((data) => {
        setLivePrices(data);
      })
      .catch((err) => console.error("Error fetching latest prices:", err));
  }, [API_BASE_URL]);

  useEffect(() => {
    if (Object.keys(livePrices).length === 0) return;

    const priceB = livePrices[currencyB] || 0.001;
    const priceC = livePrices[currencyC] || 0.001;

    setRateDB(parseFloat((1 / priceB).toFixed(2)));
    setRateBC(parseFloat((priceC / priceB).toFixed(2)));
    setRateCD(parseFloat((1 / priceC).toFixed(5)));
  }, [currencyB, currencyC, livePrices]);

  const amountB = investment * rateDB;
  const amountC = rateBC > 0 ? amountB / rateBC : 0;
  const finalD = rateCD > 0 ? amountC / rateCD : 0;

  const profit = finalD - investment;
  const profitPct = investment > 0 ? (profit / investment) * 100 : 0;

  const profitText =
    investment === 0
      ? ""
      : profit > 0
        ? `${profitPct.toFixed(0)}% Profit`
        : profit < 0
          ? `${Math.abs(profitPct).toFixed(0)}% Loss`
          : "0% Profit";

  const getGoldCost = (id: string) =>
    currencies.find((c) => c.id === id)?.gold_cost || 100;
  const taxB = amountB * getGoldCost(currencyB);
  const taxC = amountC * getGoldCost(currencyC);
  const taxD = finalD * getGoldCost("divine");
  const totalGold = taxB + taxC + taxD;

  const getCurrencyName = (id: string) => {
    const found = currencies.find((c) => c.id === id);
    return found ? found.name.toUpperCase() : id.toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 mt-4 flex flex-col gap-5 transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-3 transition-colors duration-300">
        <Calculator
          className="text-purple-500 dark:text-purple-400"
          size={20}
        />
        <span className="font-bold tracking-wide">Arbitrage Simulator</span>
      </div>

      {/* Initial Investment */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
          Initial Investment
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg rounded px-3 py-2 w-full border border-slate-300 dark:border-slate-600 focus:border-purple-500 outline-none transition-colors duration-300 shadow-inner dark:shadow-none"
          />
          <span className="text-yellow-600 dark:text-yellow-400 font-bold tracking-wider">
            DIVINE
          </span>
        </div>
      </div>

      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <ArrowDown size={14} className="text-slate-400" />
        </div>
      </div>

      {/* Step 1: D -> B */}
      <RateInputRow
        stepNum={1}
        fromLabel="DIVINE"
        toCurrency={currencyB}
        setTargetCurrency={setCurrencyB}
        rateValue={rateDB}
        setRateValue={setRateDB}
        currencies={currencies}
        isFixedTarget={false}
        resultAmount={amountB}
        resultLabel={getCurrencyName(currencyB)}
      />

      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <ArrowDown size={14} className="text-slate-400" />
        </div>
      </div>

      {/* Step 2: B -> C */}
      <RateInputRow
        stepNum={2}
        fromLabel={getCurrencyName(currencyB)}
        toCurrency={currencyC}
        setTargetCurrency={setCurrencyC}
        rateValue={rateBC}
        setRateValue={setRateBC}
        currencies={currencies}
        isFixedTarget={false}
        resultAmount={amountC}
        resultLabel={getCurrencyName(currencyC)}
      />

      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <ArrowDown size={14} className="text-slate-400" />
        </div>
      </div>

      {/* Step 3: C -> D */}
      <RateInputRow
        stepNum={3}
        fromLabel={getCurrencyName(currencyC)}
        toCurrency="DIVINE"
        setTargetCurrency={() => {}}
        rateValue={rateCD}
        setRateValue={setRateCD}
        currencies={currencies}
        isFixedTarget={true}
        resultAmount={finalD}
        resultLabel="DIVINE"
      />

      {/* Final Summary Panel */}
      <div
        className={`mt-2 p-5 rounded-xl border shadow-md transition-colors duration-300 ${
          profit > 0
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50"
            : profit < 0
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50"
              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}
      >
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Final Return:
          </span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {finalD.toFixed(4)} D
          </span>
        </div>
        <div className="flex justify-between items-center mb-5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
            Net Profit:
          </span>
          <span
            className={`text-xl font-black font-mono ${
              profit > 0
                ? "text-green-600 dark:text-green-400"
                : profit < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {profitText}
          </span>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700/70 pt-3 flex justify-between items-center bg-slate-100 dark:bg-slate-900/40 -mx-5 -mb-5 px-5 py-3 rounded-b-xl transition-colors duration-300">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Coins size={16} className="text-yellow-600 dark:text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Est. Gold Tax
            </span>
          </div>
          <span className="font-mono font-bold text-yellow-600 dark:text-yellow-500">
            {totalGold.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}

// Reusable Component for each conversion step
function RateInputRow({
  stepNum,
  fromLabel,
  toCurrency,
  setTargetCurrency,
  rateValue,
  setRateValue,
  currencies,
  isFixedTarget,
  resultAmount,
  resultLabel,
}: any) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-4 relative transition-colors duration-300">
      {/* Step Badge */}
      <div className="absolute -top-2.5 -left-2.5 bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-purple-400 shadow-sm">
        STEP {stepNum}
      </div>

      <div className="flex items-start justify-between mt-1">
        {/* Left Side: Conversion Path*/}
        <div className="flex flex-col gap-1.5 w-[55%]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Conversion Path
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold text-slate-700 dark:text-slate-300 w-[150px] inline-block truncate"
              title={fromLabel}
            >
              {fromLabel}
            </span>
            <ArrowRight
              size={14}
              className="text-slate-400 dark:text-slate-500 flex-shrink-0"
            />

            {isFixedTarget ? (
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                DIVINE
              </span>
            ) : (
              <select
                value={toCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="bg-white dark:bg-slate-900 text-xs font-bold text-blue-600 dark:text-blue-300 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-1 outline-none w-full max-w-[150px] cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300"
              >
                {currencies.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Right Side: Rate Input */}
        <div className="flex flex-col items-end gap-1.5 w-[45%]">
          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
            Exchange Rate
          </span>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all w-full max-w-[130px] shadow-inner dark:shadow-none">
            <Edit2
              size={12}
              className="text-slate-400 dark:text-slate-500 flex-shrink-0"
            />
            <input
              type="number"
              value={rateValue}
              onChange={(e) => setRateValue(Number(e.target.value))}
              className="bg-transparent text-slate-900 dark:text-white font-mono text-sm w-full outline-none text-right transition-colors duration-300"
            />
          </div>
        </div>
      </div>

      {/* Bottom Side: Resulting Amount Yield */}
      <div className="bg-slate-100 dark:bg-slate-900/80 rounded-lg px-3 py-2 flex justify-between items-center border border-slate-200 dark:border-slate-700/50 mt-1 transition-colors duration-300">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Yields Amount:
        </span>
        <span className="font-mono font-bold text-[15px] text-green-600 dark:text-green-400 truncate">
          {resultAmount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5,
          })}
          <span className="text-xs text-green-700/80 dark:text-green-600/80 ml-1">
            {resultLabel}
          </span>
        </span>
      </div>
    </div>
  );
}
