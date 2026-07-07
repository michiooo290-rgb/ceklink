"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink } from "lucide-react";
import AnimatedScanLoader from "./AnimatedScanLoader";
import { useToast } from "./Toast";

const MAX_SIZE = 200 * 1024 * 1024; // 200 MB

function formatBytes(bytes) {
  if (bytes == null) return "-";
  if (bytes < 1024) return bytes + " B";
  const units = ["KB", "MB", "GB"];
  let val = bytes / 1024;
  let i = 0;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i += 1;
  }
  return val.toFixed(1) + " " + units[i];
}

async function sha256(file) {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const STATUS_META = {
  safe: { color: "#2DCB85", Icon: ShieldCheck, title: "File Aman" },
  danger: { color: "#E55C30", Icon: ShieldAlert, title: "File Berbahaya" },
  suspicious: { color: "#F5A623", Icon: ShieldAlert, title: "Perlu Waspada" },
  unknown: { color: "#8888aa", Icon: ShieldQuestion, title: "Belum Diketahui" },
};

export default function FileScanner() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const scanCountRef = useRef({ count: 0, resetTime: Date.now() + 60000 });
  const { toast } = useToast();

  const pickFile = (f) => {
    setError("");
    setResult(null);
    if (!f) return;
    if (f.size > MAX_SIZE) {
      setError("Ukuran file terlalu besar (maks 200 MB).");
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    pickFile(f);
  }, []);

  const handleScan = async () => {
    if (!file) {
      setError("Pilih file dulu untuk diperiksa.");
      return;
    }
    setError("");
    setResult(null);

    // Rate limit sisi klien: maks 10 pemindaian / menit
    const now = Date.now();
    if (now > scanCountRef.current.resetTime) {
      scanCountRef.current = { count: 0, resetTime: now + 60000 };
    }
    if (scanCountRef.current.count >= 10) {
      const secondsLeft = Math.ceil((scanCountRef.current.resetTime - now) / 1000);
      setError("Terlalu banyak pemindaian. Coba lagi dalam " + secondsLeft + " detik.");
      return;
    }
    scanCountRef.current.count += 1;

    setLoading(true);
    try {
      const hash = await sha256(file);
      const res = await fetch("/api/file-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, fileName: file.name, fileSize: file.size }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memeriksa file. Coba lagi.");
        return;
      }
      setResult(data);
      const status = data.combined && data.combined.status;
      toast(
        status === "danger"
          ? "\u26a0\ufe0f Hati-hati \u2014 file ini terindikasi berbahaya."
          : status === "safe"
          ? "Pemeriksaan selesai. Tidak ada indikator berbahaya pada file ini."
          : "Pemeriksaan selesai. Lihat hasilnya di bawah.",
        { type: status === "danger" ? "danger" : "success" }
      );
    } catch (err) {
      setError("Terjadi kesalahan saat memeriksa file. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const vt = result && result.virustotal;
  const status = (result && result.combined && result.combined.status) || "unknown";
  const meta = STATUS_META[status] || STATUS_META.unknown;
  const StatusIcon = meta.Icon;

  return (
    <section id="cek-file" className="relative py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <FileText size={28} className="text-[#2DCB85]" aria-hidden="true" />
            Cek File & APK
          </h2>
          <p className="text-[#666680]">
            Curiga sama file APK, PDF, atau dokumen kiriman? Periksa dulu sebelum dibuka.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current && inputRef.current.click()}
          className={
            "cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors " +
            (dragging
              ? "border-[#2DCB85] bg-[rgba(45,203,133,0.06)]"
              : "border-[#2e3348] hover:border-[#2DCB85]/40 bg-[#12151f]/40")
          }
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => pickFile(e.target.files && e.target.files[0])}
          />
          <UploadCloud size={36} className="mx-auto mb-3 text-[#2DCB85]" aria-hidden="true" />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-[#e0e0e0]">
              <FileText size={16} />
              <span className="font-mono text-sm break-all">{file.name}</span>
              <span className="text-[#666680] text-xs">({formatBytes(file.size)})</span>
            </div>
          ) : (
            <>
              <p className="text-[#e0e0e0] font-medium">Tarik file ke sini atau klik untuk memilih</p>
              <p className="text-[#666680] text-sm mt-1">APK, PDF, DOC, ZIP, dll — maks 200 MB</p>
            </>
          )}
        </div>

        {/* Catatan privasi */}
        <p className="mt-3 text-center text-xs text-[#666680]">
          🔒 File kamu <strong>tidak diunggah</strong>. Yang dikirim hanya sidik jari digital (hash) file untuk dicek ke database VirusTotal.
        </p>

        {/* Tombol aksi */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleScan}
            disabled={loading || !file}
            className="btn-glow px-8 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memeriksa..." : "Periksa File"}
          </button>
          {file && !loading && (
            <button
              onClick={reset}
              className="px-6 py-4 rounded-xl text-base font-medium text-[#8888aa] hover:text-white border border-[#2e3348] hover:border-[#2DCB85]/30 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-4 px-4 py-2 rounded-lg bg-[#E55C30]/10 border border-[#E55C30]/30 text-[#E55C30] text-sm text-center"
              role="alert"
              initial={ { opacity: 0, y: -6 } }
              animate={ { opacity: 1, y: 0 } }
              exit={ { opacity: 0, y: -6 } }
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader */}
        {loading && <AnimatedScanLoader label="Memeriksa file\u2026" />}

        {/* Hasil */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="file-result"
              className="mt-6 rounded-2xl border p-6"
              style={ { borderColor: meta.color + "40", background: "rgba(18,21,31,0.5)" } }
              initial={ { opacity: 0, y: 16 } }
              animate={ { opacity: 1, y: 0 } }
              exit={ { opacity: 0, y: 8 } }
              transition={ { duration: 0.3 } }
            >
              <div className="flex items-center gap-3 mb-4">
                <StatusIcon size={28} style={ { color: meta.color } } aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold" style={ { color: meta.color } }>{meta.title}</h3>
                  {vt && vt.label && <p className="text-sm text-[#a0a5b8]">{vt.label}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-[#666680]">Nama file</span>
                  <p className="text-[#e0e0e0] font-mono break-all">{result.fileName || "-"}</p>
                </div>
                <div>
                  <span className="text-[#666680]">Ukuran</span>
                  <p className="text-[#e0e0e0]">{formatBytes(result.fileSize)}</p>
                </div>
                {vt && vt.typeDescription && (
                  <div>
                    <span className="text-[#666680]">Jenis</span>
                    <p className="text-[#e0e0e0]">{vt.typeDescription}</p>
                  </div>
                )}
                {vt && vt.found && (
                  <div>
                    <span className="text-[#666680]">Deteksi</span>
                    <p className="text-[#e0e0e0]">
                      <span style={ { color: vt.malicious > 0 ? "#E55C30" : "#2DCB85" } }>{vt.malicious}</span>
                      {" / " + vt.total + " antivirus"}
                    </p>
                  </div>
                )}
              </div>

              {vt && vt.available && !vt.found && (
                <div className="rounded-lg bg-[#8888aa]/10 border border-[#8888aa]/20 px-4 py-3 text-sm text-[#a0a5b8]">
                  File ini belum pernah dilaporkan ke VirusTotal. Bukan berarti pasti aman — kalau file berasal dari sumber tidak dikenal, sebaiknya jangan dibuka atau dipasang.
                </div>
              )}

              {vt && !vt.available && (
                <div className="rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 px-4 py-3 text-sm text-[#F5A623]">
                  Layanan pemeriksaan file sedang tidak tersedia{vt.reason ? " (" + vt.reason + ")" : ""}.
                </div>
              )}

              {vt && vt.found && vt.permalink && (
                <a
                  href={vt.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#2DCB85] hover:underline"
                >
                  Lihat laporan lengkap di VirusTotal
                  <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
