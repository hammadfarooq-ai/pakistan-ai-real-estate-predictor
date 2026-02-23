"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/predict", label: "Price Prediction" },
  { href: "/insights", label: "Market Insights" },
  { href: "/roi", label: "ROI Calculator" },
  { href: "/map", label: "Map View" }
];

export function Navbar() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const initial = localStorage.getItem("theme") === "light";
    setLight(initial);
    document.body.classList.toggle("light", initial);
  }, []);

  const toggleTheme = () => {
    const next = !light;
    setLight(next);
    document.body.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <div className="app-shell flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-brand-600 px-2 py-1 text-xs font-bold text-white">AI</span>
          <span className="text-sm font-semibold sm:text-base">Pakistan Real Estate Predictor</span>
        </div>

        <nav className="hidden gap-4 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <button type="button" onClick={toggleTheme} className="button-secondary px-3 py-2" aria-label="Toggle theme">
          {light ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
