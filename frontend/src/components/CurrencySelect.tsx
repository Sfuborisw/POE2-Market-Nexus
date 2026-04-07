import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Currency {
  id: string;
  name: string;
  icon_url: string;
  gold_cost: number;
}

interface CurrencySelectProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  selectedCurrency,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fallbackImage =
    "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlVG9SYXJlIiwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/7ca519f632/CurrencyUpgradeToRare.png";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block transition-colors duration-300">
        Select Currency
      </label>

      {/* 🌟 Updated Dropdown Button for Light/Dark Mode */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 rounded-lg p-3 flex items-center justify-between transition-colors focus:outline-none focus:border-blue-500 shadow-sm dark:shadow-none"
      >
        <div className="flex items-center gap-3">
          {selectedCurrency ? (
            <>
              <img
                src={selectedCurrency.icon_url}
                alt={selectedCurrency.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                  target.onerror = null;
                }}
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                {selectedCurrency.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Select an option...
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 🌟 Updated Dropdown Menu for Light/Dark Mode */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto transition-colors duration-300">
          {currencies.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">
              Loading data...
            </div>
          ) : (
            <ul className="py-1">
              {currencies.map((currency) => (
                <li key={currency.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(currency);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                      selectedCurrency?.id === currency.id
                        ? "bg-slate-50 dark:bg-slate-800/80 border-l-2 border-blue-500"
                        : "border-l-2 border-transparent"
                    }`}
                  >
                    <img
                      src={currency.icon_url}
                      alt={currency.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                        target.onerror = null;
                      }}
                    />
                    <span className="text-sm text-slate-900 dark:text-slate-200">
                      {currency.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencySelect;
