import { useEffect, useState } from "react";

function App() {
  const [prices, setPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/prices")
      .then((res) => res.json())
      .then((data) => setPrices(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredPrices = prices.filter((p) =>
    p.item_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">
              POE2 <span className="text-blue-500">NEXUS</span>
            </span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <span className="cursor-pointer hover:text-blue-500 transition-colors">
              Market
            </span>
            <span className="cursor-pointer text-slate-500 hover:text-blue-500 transition-colors">
              Analytics
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-24 px-6 max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-3">
            Market Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Live trading data for Path of Exile 2 items.
          </p>
        </header>

        <div className="mb-8 relative group">
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Asset Name
                </th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                  Price (Gold)
                </th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                  Last Observed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPrices.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">
                    {p.item_name}
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono text-lg text-blue-600 dark:text-blue-400">
                      {p.price_value.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right text-xs text-slate-400 group-hover:text-slate-500">
                    {new Date(p.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400">
        © 2026 POE2 Market Nexus • Optimized for SFU Developers
      </footer>
    </div>
  );
}

export default App;
