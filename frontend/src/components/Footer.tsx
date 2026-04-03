import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2026 POE2 Market Nexus. Built by{" "}
          <span className="font-bold text-purple-500">Boris Wong</span>.
        </p>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-purple-500 transition-all focus:outline-none"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </footer>
  );
}
