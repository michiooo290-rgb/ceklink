"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Cek Link", href: "#cek-link" },
  { label: "Database", href: "#database" },
  { label: "Edukasi", href: "#edukasi" },
  { label: "API", href: "#api" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cyber-border"
      style={{ borderRadius: 0 }}
      role="navigation"
      aria-label="Navigasi utama"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#beranda"
            className="flex items-center gap-2 font-heading font-bold text-xl text-cyber-green"
          >
            <ShieldCheck size={24} aria-hidden="true" />
            CekLink
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-cyber-muted hover:text-cyber-green transition-colors rounded-lg hover:bg-cyber-green/5"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-cyber-muted hover:text-cyber-green transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 border-t border-cyber-border mt-2 pt-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-cyber-muted hover:text-cyber-green transition-colors rounded-lg hover:bg-cyber-green/5"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
