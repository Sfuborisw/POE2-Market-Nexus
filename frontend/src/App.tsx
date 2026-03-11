import { useEffect, useState } from "react";

interface PriceData {
  item_name: string;
  price_value: number;
  timestamp: string;
}

function App() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/prices")
      .then((res) => res.json())
      .then((data: PriceData[]) => setPrices(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const filteredPrices = prices.filter((p) =>
    p.item_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white font-sans">
      <nav className="bg-[#15181e] border-b border-slate-800 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#d4af37] flex items-center justify-center font-bold text-[#d4af37]">
              N
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              Market <span className="text-[#d4af37]">Nexus</span>
            </h1>
          </div>

          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a
              href="#"
              className="text-[#d4af37] hover:text-white transition-colors"
            >
              Market
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Analytics
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Settings
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Search & Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#15181e] p-6 border border-slate-800 rounded-lg shadow-xl">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
              Inventory Size
            </span>
            <p className="text-3xl font-mono text-[#d4af37] mt-1">
              {prices.length}
            </p>
          </div>
          <div className="md:col-span-3 bg-[#15181e] p-4 border border-slate-800 rounded-lg flex items-center">
            <span className="mr-4 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="SEARCH ITEMS (E.G. EXALTED)..."
              className="bg-transparent w-full outline-none text-white placeholder:text-slate-700 uppercase text-sm font-medium tracking-widest"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#15181e] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#1c2029] border-b border-slate-800">
              <tr>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Item Name
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  Market Price
                </th>
                <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  Observed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPrices.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/20 transition-all duration-200"
                >
                  <td className="p-5 text-slate-100 font-bold tracking-tight">
                    {p.item_name}
                  </td>
                  <td className="p-5 text-right">
                    <span className="text-white font-mono text-lg">
                      {p.price_value.toLocaleString()}
                    </span>
                    <span className="ml-2 text-[10px] text-[#d4af37] font-black italic">
                      GOLD
                    </span>
                  </td>
                  <td className="p-5 text-right text-xs font-medium text-slate-500">
                    {new Date(p.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
