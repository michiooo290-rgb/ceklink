"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, Link } from "lucide-react";
import { scanURL } from "../lib/scanner";
import ResultCard from "./ResultCard";

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const scanCountRef = useRef({ count: 0, resetTime: Date.now() + 60000 });
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Masukkan URL terlebih dahulu.");
      inputRef.current?.focus();
      return;
    }

    // --- Max length check ---
    if (trimmed.length > 2048) {
      setError("URL terlalu panjang. Maksimal 2048 karakter.");
      return;
    }

    // --- Block dangerous protocols explicitly ---
    if (/^(javascript|data|vbscript|file|ftp):/i.test(trimmed)) {
      setError("Protokol URL tidak diizinkan. Gunakan http:// atau https://.");
      return;
    }

    // --- Block obvious XSS / injection patterns ---
    if (/[<>"'`{}\\]/.test(trimmed) || /[\x00-\x1f]/.test(trimmed)) {
      setError("URL mengandung karakter yang tidak diizinkan.");
      return;
    }

    // --- Normalize: prepend https:// if no protocol ---
    let normalized = trimmed;
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }

    // --- Structural URL validation ---
    let parsed;
    try {
      parsed = new URL(normalized);
    } catch {
      setError("Format URL tidak valid. Contoh: https://example.com atau bit.ly/promo");
      return;
    }

    // Must be http or https (belt-and-suspenders after protocol block)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      setError("Hanya protokol http dan https yang diizinkan.");
      return;
    }

    // Hostname must contain at least one dot and valid TLD
    const hostname = parsed.hostname;
    if (!hostname || !hostname.includes(".")) {
      setError("Format URL tidak valid. Contoh: https://example.com atau bit.ly/promo");
      return;
    }

    // Block IP addresses (optional: you may remove this if IPs are needed)
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      setError("Pemindaian IP address langsung tidak didukung.");
      return;
    }

    // --- Client-side rate limiting: max 10 scans per minute ---
    const now = Date.now();
    if (now > scanCountRef.current.resetTime) {
      // Window expired, reset counter
      scanCountRef.current = { count: 0, resetTime: now + 60000 };
    }
    if (scanCountRef.current.count >= 10) {
      const secondsLeft = Math.ceil((scanCountRef.current.resetTime - now) / 1000);
      setError(`Terlalu banyak pemindaian. Coba lagi dalam ${secondsLeft} detik.`);
      return;
    }
    scanCountRef.current.count += 1;

    setLoading(true);

    try {
      const data = await scanURL(normalized);
      setResult(data);
    } catch (err) {
      setError("Terjadi kesalahan saat memindai. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "https://tokopedia.com",
    "bit.ly/promo-bca",
    "tokoped1a-sale.com",
  ];

  return (
    <section id="cek-link" className="relative py-16 sm:py-24" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Search size={28} className="text-[#2DCB85]" aria-hidden="true" />
            </motion.div>
            Pemeriksa URL
          </h2>
          <p className="text-[#666680]">
            Tempel link di bawah untuk mulai menganalisis
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleScan}
          className="relative"
          role="search"
          aria-label="Cek URL"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              className="flex-1 relative"
              whileFocus={{ scale: 1.02 }}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666680]" aria-hidden="true">
                <Link size={18} />
              </span>
              <input
                ref={inputRef}
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contoh: tokopedia.com atau bit.ly/promo"
                className="input-glow w-full pl-11 pr-4 py-4 rounded-xl text-base font-mono text-[#e0e0e0] placeholder:text-[#666680]/50"
                aria-label="URL yang akan diperiksa"
                disabled={loading}
                maxLength={2048}
                autoComplete="url"
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-glow px-8 py-4 rounded-xl text-base font-semibold whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 136, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <motion.svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </motion.svg>
                  Scan...
                </>
              ) : (
                <>
                  <Search size={18} aria-hidden="true" />
                  Cek
                </>
              )}
            </motion.button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-3 px-4 py-2 rounded-lg bg-[#E55C30]/10 border border-[#E55C30]/30 text-[#E55C30] text-sm"
                role="alert"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Quick Examples */}
        <motion.div
          className="mt-4 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-[#666680] text-sm">Contoh:</span>
          {examples.map((example, i) => (
            <motion.button
              key={example}
              onClick={() => {
                setUrl(example);
                setResult(null);
                setError("");
              }}
              className="text-sm font-mono text-[#666680] hover:text-[#2DCB85] px-3 py-2 rounded-lg border border-[#2e3348] hover:border-[#2DCB85]/30 transition-colors min-h-[44px] flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {example}
            </motion.button>
          ))}
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResultCard result={result} url={url} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
