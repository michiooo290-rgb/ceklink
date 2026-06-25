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

    // Basic URL validation — supports: bit.ly/x, tokopedia.com, http://example.com/path
    // Very permissive to avoid false negatives
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const domainLike = trimmed.replace(/^https?:\/\//i, "").split("/")[0];
    const hasDot = domainLike.includes(".");
    const hasValidChars = /^[\w.-]+(\.\w{2,})/.test(domainLike);

    if (!hasDot || !hasValidChars) {
      setError("Format URL tidak valid. Contoh: https://example.com atau bit.ly/promo");
      return;
    }

    setLoading(true);

    try {
      const data = await scanURL(trimmed);
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
              <Search size={28} className="text-[#00ff88]" aria-hidden="true" />
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
                className="mt-3 px-4 py-2 rounded-lg bg-[#ff3b3b]/10 border border-[#ff3b3b]/30 text-[#ff3b3b] text-sm"
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
              className="text-sm font-mono text-[#666680] hover:text-[#00ff88] px-3 py-2 rounded-lg border border-[#1a1a2e] hover:border-[#00ff88]/30 transition-colors min-h-[44px] flex items-center"
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
