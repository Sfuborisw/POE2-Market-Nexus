import { useEffect, useState } from "react";

interface PriceData {
  item_name: string;
  price_value: number;
  timestamp: string;
}

function App() {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/prices")
      .then((res) => res.json())
      .then((data: PriceData[]) => setPrices(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      <nav className="bg-[#161616] border-b border-[#2a2a2a] px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8a165] rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(200,161,101,0.3)]">
              <span className="rotate-[-45deg] text-[#0f0f0f] font-black">
                N
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#c8a165] tracking-widest uppercase">
              Nexus <span className="text-gray-500 font-light">v2</span>
            </h1>
          </div>

          <div className="flex gap-6 text-sm uppercase tracking-tighter font-medium">
            <a href="#" className="text-[#c8a165] border-b border-[#c8a165]">
              Market
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Currency
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              History
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-6">
          <h1 className="text-4xl font-extrabold text-[#c8a165] tracking-tighter uppercase">
            Market Dashboard
          </h1>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded border border-[#2a2a2a]">
            <span className="text-sm text-gray-500 uppercase tracking-widest">
              Inventory Size
            </span>
            <p className="text-2xl font-mono text-[#c8a165]">{prices.length}</p>
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#c8a165] text-sm uppercase">
              <tr>
                <th className="p-4 border-b border-[#2a2a2a]">Item Name</th>
                <th className="p-4 border-b border-[#2a2a2a] text-right">
                  Market Price
                </th>
                <th className="p-4 border-b border-[#2a2a2a]">Last Observed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {prices.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 font-semibold text-gray-100 group-hover:text-[#c8a165]">
                    {p.item_name}
                  </td>
                  <td className="p-4 text-right font-mono text-amber-400">
                    {p.price_value}{" "}
                    <span className="text-xs text-gray-600">Gold</span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 italic">
                    {new Date(p.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
