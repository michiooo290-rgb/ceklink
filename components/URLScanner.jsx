"use client";

import { useState, useRef } from "react";
import { Search, Link } from "lucide-react";
import { scanURL } from "../lib/scanner";
import ResultCard from "./ResultCard";

const MAX_SCANS_PER_MIN = 10;
const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file|ftp):/i;
const BAD_CHARS = /[<>"'`{}\\]/;

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const scanCount = useRef({ count: 0, resetAt: Date.now() + 60000 });

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
    if (trimmed.length > 2048) {
      setError("URL terlalu panjang.");
      return;
    }
    if (BLOCKED_PROTOCOLS.test(trimmed) || BAD_CHARS.test(trimmed) || /[\x00-\x1f]/.test(trimmed)) {
      setError("URL mengandung karakter atau protokol yang tidak diizinkan.");
      return;
    }

    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    let parsed;
    try {
      parsed = new URL(normalized);
    } catch {
      setError("Format URL tidak valid. Contoh: https://example.com atau bit.ly/promo");
      return;
    }

    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) {
      setError("Format URL tidak valid. Contoh: https://example.com atau bit.ly/promo");
      return;
    }
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname)) {
      setError("Pemindaian IP address langsung belum didukung.");
      return;
    }

    const now = Date.now();
    if (now > scanCount.current.resetAt) {
      scanCount.current = { count: 0, resetAt: now + 60000 };
    }
    if (scanCount.current.count >= MAX_SCANS_PER_MIN) {
      const wait = Math.ceil((scanCount.current.resetAt - now) / 1000);
      setError(`Terlalu banyak pemindaian, coba lagi dalam ${wait} detik.`);
      return;
    }
    scanCount.current.count += 1;

    setLoading(true);
    try {
      const data = await scanURL(normalized);
      setResult(data);
    } catch {
      setError("Terjadi kesalahan saat memindai. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const examples = ["https://tokopedia.com", "bit.ly/promo-bca", "tokoped1a-sale.com"];

  return (
    <section id="cek-link" className="relative py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <Search size={28} className="text-[#2DCB85]" />
            Pemeriksa URL
          </h2>
          <p className="text-[#666680]">Tempel link di bawah untuk mulai menganalisis</p>
        </div>

        <form onSubmit={handleScan} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666680]">
                <Link size={18} />
              </span>
              <input
                ref={inputRef}
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="tokopedia.com atau bit.ly/promo"
                className="input-glow w-full pl-11 pr-4 py-4 rounded-xl text-base text-[#e0e0e0] placeholder:text-[#666680]/50"
                disabled={loading}
                maxLength={2048}
                autoComplete="url"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-glow px-8 py-4 rounded-xl text-base font-semibold whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px] hover:scale-[1.02] active:scale-95 transition-transform"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scan...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Cek
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-3 px-4 py-2 rounded-lg bg-[#E55C30]/10 border border-[#E55C30]/30 text-[#E55C30] text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="text-[#666680] text-sm">Contoh:</span>
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => {
                setUrl(example);
                setResult(null);
                setError("");
              }}
              className="text-sm text-[#666680] hover:text-[#2DCB85] px-3 py-2 rounded-lg border border-[#2e3348] hover:border-[#2DCB85]/30 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        {result && (
          <div className="mt-8">
            <ResultCard result={result} url={url} />
          </div>
        )}
      </div>
    </section>
  );
}