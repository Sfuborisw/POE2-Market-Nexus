import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// 1. Updated Interface: Now we expect all these fields from the backend
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

  // Handle clicking outside the dropdown to close it
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

  // Fallback image URL in case the official CDN fails
  const fallbackImage =
    "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lVcGdyYWRlVG9SYXJlIiwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/7ca519f632/CurrencyUpgradeToRare.png";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
        Select Currency
      </label>

      {/* 2. Main dropdown button (Image + Text) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg p-3 flex items-center justify-between transition-colors focus:outline-none focus:border-blue-500"
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
                  target.onerror = null; // Prevent infinite loop
                }}
              />
              <span className="text-sm font-semibold text-slate-200">
                {selectedCurrency.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-400">Select an option...</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 3. Dropdown menu list (Image + Text) */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {currencies.length === 0 ? (
            <div className="p-4 text-sm text-slate-400 text-center">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left ${
                      selectedCurrency?.id === currency.id
                        ? "bg-slate-800/80 border-l-2 border-blue-500"
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
                    <span className="text-sm text-slate-200">
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
