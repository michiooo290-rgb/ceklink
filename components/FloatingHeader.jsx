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

export default function FloatingHeader() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#beranda");

  // Use ref instead of state for scroll position (avoids re-renders)
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Cache section elements to avoid DOM queries on every scroll
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Cache section elements once on mount
    sectionRefs.current = NAV_ITEMS
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => ({
        href: item.href,
        el: document.getElementById(item.href.replace("/#", "")),
      }));
  }, []);

  const updateHeader = useCallback(() => {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY.current;

    // Show/hide based on scroll direction
    if (currentScrollY < 10) {
      setVisible(true);
      setAtTop(true);
    } else if (diff < -5) {
      // Scrolling up (with threshold to avoid jitter)
      setVisible(true);
      setAtTop(false);
    } else if (diff > 5 && currentScrollY > 80) {
      // Scrolling down
      setVisible(false);
      setMobileOpen(false);
      setAtTop(false);
    }

    lastScrollY.current = currentScrollY;

    // Detect active section (throttled via rAF)
    for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
      const { href, el } = sectionRefs.current[i];
      if (el && el.getBoundingClientRect().top <= 120) {
        setActiveSection(href);
        break;
      }
    }
    // If no section detected and we're at top, set home
    if (window.scrollY < 100) {
      setActiveSection("/#beranda");
    }

    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle with requestAnimationFrame
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateHeader]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      role="banner"
      style={{ willChange: "transform" }}
    >
      <div
        className={`mx-auto max-w-5xl px-4 pt-3 sm:pt-4 transition-all duration-500 ${
          atTop ? "sm:pt-6" : ""
        }`}
      >
        <nav
          className={`relative rounded-2xl border transition-all duration-500 ${
            atTop
              ? "bg-transparent border-transparent shadow-none"
              : "bg-[rgba(26,30,46,0.8)] backdrop-blur-xl border-[rgba(245,166,35,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.02)_inset]"
          }`}
          role="navigation"
          aria-label="Navigasi utama"
        >
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <a
                href="#beranda"
                className="flex items-center gap-2.5 font-bold text-lg text-white group transition-all"
              >
                <Image
                  src="/logo.png"
                  alt="Urlveil"
                  width={120}
                  height={40}
                  className="object-contain"
                  priority
                />
              </a>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                        isActive
                          ? "text-[#F5A623] bg-[rgba(245,166,35,0.08)]"
                          : "text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#F5A623] rounded-full shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* CTA Buttons */}
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

              {/* Mobile Hamburger */}
              <button
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              id="mobile-menu"
              className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
                mobileOpen ? "max-h-80 pb-4" : "max-h-0"
              }`}
            >
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-3 mt-1 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? "text-[#F5A623] bg-[rgba(245,166,35,0.08)]"
                          : "text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                })}
                <a
                  href="/login"
                  className="flex items-center gap-2 px-4 py-3 mt-2 text-sm font-medium rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn size={16} />
                  Masuk
                </a>
                <a
                  href="#cek-link"
                  className="block px-4 py-3 mt-1 text-sm font-semibold text-center rounded-xl bg-gradient-to-r from-[#F5A623] to-[#2DCB85] text-[#1a1e2e]"
                  onClick={() => setMobileOpen(false)}
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