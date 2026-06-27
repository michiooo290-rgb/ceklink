"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LogIn } from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Cek Link", href: "/#cek-link" },
  { label: "Database", href: "/#database" },
  { label: "Edukasi", href: "/edukasi" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
];

const SCROLL_TOP_LIMIT = 10;
const SCROLL_HIDE_LIMIT = 80;
const SCROLL_DELTA = 5;
const ACTIVE_OFFSET = 120;

export default function FloatingHeader() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#beranda");

  const lastY = useRef(0);
  const rafId = useRef(null);
  const sections = useRef([]);

  useEffect(() => {
    sections.current = NAV_ITEMS
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => ({
        href: item.href,
        el: document.getElementById(item.href.replace("/#", "")),
      }));
  }, []);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    const diff = y - lastY.current;

    if (y < SCROLL_TOP_LIMIT) {
      setVisible(true);
      setAtTop(true);
    } else if (diff < -SCROLL_DELTA) {
      setVisible(true);
      setAtTop(false);
    } else if (diff > SCROLL_DELTA && y > SCROLL_HIDE_LIMIT) {
      setVisible(false);
      setMobileOpen(false);
      setAtTop(false);
    }

    lastY.current = y;

    let found = null;
    for (let i = sections.current.length - 1; i >= 0; i--) {
      const s = sections.current[i];
      if (s.el && s.el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
        found = s.href;
        break;
      }
    }
    setActiveSection(y < 100 ? "/#beranda" : found || activeSection);

    rafId.current = null;
  }, [activeSection]);

  useEffect(() => {
    const handler = () => {
      if (rafId.current == null) {
        rafId.current = requestAnimationFrame(onScroll);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [onScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className={`mx-auto max-w-5xl px-4 pt-3 sm:pt-4 ${atTop ? "sm:pt-6" : ""} transition-all duration-500`}>
        <nav
          className={`relative rounded-2xl border transition-all duration-500 ${
            atTop
              ? "bg-transparent border-transparent shadow-none"
              : "bg-[rgba(26,30,46,0.8)] backdrop-blur-xl border-[rgba(245,166,35,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.02)_inset]"
          }`}
        >
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <a href="#beranda" className="flex items-center gap-2.5 font-bold text-lg text-white">
                <Image src="/logo.png" alt="Urlveil" width={120} height={40} className="object-contain" priority />
              </a>

              <div className="hidden md:flex items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                  const active = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                        active
                          ? "text-[#F5A623] bg-[rgba(245,166,35,0.08)]"
                          : "text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#F5A623] rounded-full shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
                      )}
                    </a>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2">
                <a
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
                >
                  <LogIn size={16} />
                  Masuk
                </a>
                <a
                  href="#cek-link"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#F5A623] to-[#2DCB85] text-[#1a1e2e] hover:shadow-[0_0_24px_rgba(245,166,35,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Mulai Scan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              <button
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                </div>
              </button>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${mobileOpen ? "max-h-80 pb-4" : "max-h-0"}`}>
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-3 mt-1 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const active = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        active
                          ? "text-[#F5A623] bg-[rgba(245,166,35,0.08)]"
                          : "text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 mt-2 text-sm font-medium rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
                >
                  <LogIn size={16} />
                  Masuk
                </a>
                <a
                  href="#cek-link"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 mt-1 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-[#F5A623] to-[#2DCB85] text-[#1a1e2e]"
                >
                  Mulai Scan →
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}