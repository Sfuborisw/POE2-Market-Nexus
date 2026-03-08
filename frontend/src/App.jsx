import { useEffect, useState } from 'react'

function App() {
  const [prices, setPrices] = useState([])

  useEffect(() => {
    // 記得 Backend 要開住 http://127.0.0.1:8000
    fetch('http://127.0.0.1:8000/prices')
      .then(res => res.json())
      .then(data => setPrices(data))
      .catch(err => console.error("Error fetching data:", err))
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-6">
          <h1 className="text-4xl font-extrabold text-[#c8a165] tracking-tighter uppercase">
            POE2 Market Nexus
          </h1>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded border border-[#2a2a2a]">
            <span className="text-sm text-gray-500 uppercase tracking-widest">Inventory Size</span>
            <p className="text-2xl font-mono text-[#c8a165]">{prices.length}</p>
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-[#c8a165] text-sm uppercase">
              <tr>
                <th className="p-4 border-b border-[#2a2a2a]">Item Name</th>
                <th className="p-4 border-b border-[#2a2a2a] text-right">Market Price</th>
                <th className="p-4 border-b border-[#2a2a2a]">Last Observed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {prices.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 font-semibold text-gray-100 group-hover:text-[#c8a165]">
                    {p.item_name}
                  </td>
                  <td className="p-4 text-right font-mono text-amber-400">
                    {p.price_value} <span className="text-xs text-gray-600">Gold</span>
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
  )
}

export default App