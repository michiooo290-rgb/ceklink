"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, ShieldCheck, Link, Search,
  Sparkles, Bot, User, Copy, Check, CornerDownLeft,
} from "lucide-react";
import { scanURL } from "../lib/scanner";

const QUICK_COMMANDS = [
  { icon: Search, label: "Cek URL", command: "/cek https://example.com" },
  { icon: ShieldCheck, label: "Tips Aman", command: "/tips" },
  { icon: Link, label: "Contoh Phising", command: "/contoh" },
];

const TIPS = [
  "🛡️ **Tips Keamanan Digital:**",
  "",
  "1. **Cek URL sebelum klik** — Perhatikan ejaan domain (tokoped1a ≠ tokopedia)",
  "2. **Pastikan HTTPS** — Cari ikon gembok di address bar",
  "3. **Jangan asal isi data** — Bank tidak pernah minta password via chat",
  "4. **Gunakan 2FA** — Aktifkan autentikasi dua faktor",
  "5. **Update rutin** — Selalu update browser dan OS",
  "",
  "Ketik `/cek <url>` untuk memeriksa link.",
].join("\n");

const CONTOH = [
  "⚠️ **Contoh Link Phising:**",
  "",
  "❌ `tokoped1a-sale.com` — Ejaan salah",
  "❌ `bit.ly/bca-promo2026` — Shortlink mencurigakan",
  "❌ `bri-mobile-update.xyz` — Domain aneh",
  "❌ `dana-verifikasi-akun.top` — TLD mencurigakan",
  "",
  "**Ciri-ciri:** Domain mirip salah eja, TLD aneh, minta data mendesak",
  "",
  "Ketik `/cek <url>` untuk memeriksa link.",
].join("\n");

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content: [
    "👋 **Halo! Saya Asisten Urlveil.**",
    "",
    "Saya bisa membantu:",
    "• 🔍 Mengecek keamanan link",
    "• 🛡️ Tips keamanan digital",
    "• ⚠️ Contoh link phising",
    "",
    "Gunakan perintah cepat di bawah atau ketik langsung.",
  ].join("\n"),
};

async function getResponse(input) {
  const l = input.toLowerCase().trim();

  if (l.startsWith("/cek ")) {
    const url = input.slice(5).trim();
    if (!url) return "Masukkan URL. Contoh: `/cek https://example.com`";

    try {
      const result = await scanURL(url);
      const statusIcon = result.status === "safe" ? "✅" : result.status === "warn" ? "⚠️" : "🚨";
      const lines = [
        `${statusIcon} **Hasil: ${result.statusLabel}**`,
        "",
        `🔗 \`${result.url}\``,
        `📊 Skor: ${result.score}/100`,
        `🌐 Domain: ${result.domain}`,
        "",
      ];

      // Add issues
      if (result.issues.length > 0) {
        lines.push("**Temuan:**");
        result.issues.forEach((issue) => {
          const icon = issue.status === "safe" ? "✅" : issue.status === "warn" ? "⚠️" : "❌";
          lines.push(`• ${icon} ${issue.label}: ${issue.value}`);
        });
        lines.push("");
      }

      lines.push(result.summary);

      // Add action suggestion
      if (result.status === "danger") {
        lines.push("");
        lines.push("**Saran:** Jangan buka link ini! Klik tombol Laporkan untuk melindungi orang lain.");
      } else if (result.status === "warn") {
        lines.push("");
        lines.push("**Saran:** Hati-hati. Jangan isi data pribadi di halaman ini.");
      }

      return lines.join("\n");
    } catch (err) {
      return ["❌ **Error:** Gagal menganalisis link.", "", "Pastikan URL valid dan coba lagi."].join("\n");
    }
  }

  if (l === "/tips" || l.includes("tips")) return TIPS;
  if (l === "/contoh" || l.includes("contoh")) return CONTOH;
  if (l.includes("halo") || l.includes("hai"))
    return "👋 Halo! Ketik `/cek <url>` atau `/tips` untuk mulai.";
  if (l.includes("phising") || l.includes("phishing"))
    return ["🎣 **Phising** = penipuan mencuri data via link palsu","","**Ciri:** URL salah eja, permintaan mendesak, tidak HTTPS","","Ketik `/cek <url>` untuk cek link."].join("\n");
  if (l.includes("api"))
    return ["🔌 **API Urlveil:**","",`GET https://urlveil.id/api/check?url=<url>`,"Rate Limit: 100/hari (gratis)","","Lihat bagian API Publik di bawah."].join("\n");
  return ["🤔 Coba perintah:","• `/cek <url>` — Cek link","• `/tips` — Tips aman","• `/contoh` — Contoh phising"].join("\n");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function MsgContent({ text }) {
  const MAX_RENDER_LENGTH = 2000;
  const safeText = typeof text === "string" ? escapeHtml(text.slice(0, MAX_RENDER_LENGTH)) : "";

  return (
    <div className="space-y-1">
      {safeText.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const parts = [];
        let remaining = line;
        let key = 0;

        // Process bold **text** (only allow alphanumeric, spaces, and basic punctuation)
        const boldRe = /\*\*([a-zA-Z0-9 .,;:!?\-_/]+)\*\*/g;
        let match;
        let last = 0;
        while ((match = boldRe.exec(remaining)) !== null) {
          if (match.index > last) parts.push(<span key={key++}>{remaining.slice(last, match.index)}</span>);
          parts.push(<strong key={key++} className="text-white font-semibold">{match[1]}</strong>);
          last = match.index + match[0].length;
        }
        if (last < remaining.length) parts.push(<span key={key++}>{remaining.slice(last)}</span>);
        if (parts.length === 0) parts.push(<span key={key++}>{remaining}</span>);

        // Process inline `code` within each part (only allow safe characters)
        const finalParts = parts.map((part, pi) => {
          if (typeof part.props?.children !== "string") return part;
          const txt = part.props.children;
          const codeRe = /`([a-zA-Z0-9 .,;:!?\-_/:@&=#%]+)`/g;
          const codeParts = [];
          let cm;
          let cl = 0;
          while ((cm = codeRe.exec(txt)) !== null) {
            if (cm.index > cl) codeParts.push(<span key={`c${pi}${cl}`}>{txt.slice(cl, cm.index)}</span>);
            codeParts.push(
              <code key={`c${pi}${cm.index}`} className="bg-white/10 px-1.5 py-0.5 rounded text-[#2DCB85] text-xs font-mono">{cm[1]}</code>
            );
            cl = cm.index + cm[0].length;
          }
          if (cl < txt.length) codeParts.push(<span key={`c${pi}e`}>{txt.slice(cl)}</span>);
          return codeParts.length > 0 ? codeParts : part;
        });

        return <div key={i}>{finalParts}</div>;
      })}
    </div>
  );
}

export default function AnimatedAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgs, setMsgs] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const chatRateRef = useRef({ count: 0, resetTime: Date.now() + 60000 });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const send = async (cmd) => {
    if (!cmd.trim() || typing) return;

    // Rate limiting: max 20 messages per minute
    const now = Date.now();
    if (now > chatRateRef.current.resetTime) {
      chatRateRef.current = { count: 0, resetTime: now + 60000 };
    }
    chatRateRef.current.count++;
    if (chatRateRef.current.count > 20) {
      setMsgs((p) => [...p, { id: Date.now().toString(), role: "user", content: cmd.slice(0, 50) + "..." }, { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ Terlalu banyak pesan. Tunggu sebentar sebelum mengirim lagi." }]);
      setInput("");
      return;
    }

    if (cmd.length > 500) {
      setMsgs((p) => [...p, { id: Date.now().toString(), role: "user", content: cmd.slice(0, 500) }, { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ Pesan terlalu panjang (maks 500 karakter)." }]);
      setInput("");
      return;
    }
    setMsgs((p) => [...p, { id: Date.now().toString(), role: "user", content: cmd }]);
    setInput("");
    setTyping(true);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));

    try {
      const response = await getResponse(cmd);
      setMsgs((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
    } catch (err) {
      setMsgs((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: "❌ Terjadi kesalahan. Coba lagi." }]);
    }
    setTyping(false);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\*\*/g, "").replace(/`/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#2DCB85] to-[#1FA86B] text-[#1a1e2e] shadow-[0_0_30px_rgba(0,255,136,0.4)] flex items-center justify-center hover:shadow-[0_0_40px_rgba(0,255,136,0.6)]"
            aria-label="Buka chat"
          >
            <MessageCircle size={24} />
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-[#2DCB85]"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border border-[rgba(45,203,133,0.15)] bg-[rgba(26,30,46,0.95)] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.02)_inset]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#2DCB85] to-[#1FA86B] flex items-center justify-center">
                  <Bot size={18} className="text-[#1a1e2e]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#2DCB85] border-2 border-[#1a1e2e]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Urlveil AI</h3>
                  <p className="text-xs text-[#666680]">Online · Siap membantu</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666680] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Tutup chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {msgs.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${m.role === "user" ? "bg-white/10" : "bg-gradient-to-br from-[#2DCB85]/20 to-[#1FA86B]/20"}`}>
                      {m.role === "user" ? <User size={14} className="text-white/70" /> : <Sparkles size={14} className="text-[#2DCB85]" />}
                    </div>
                    <div className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-[#2DCB85]/10 text-white border border-[#2DCB85]/20 rounded-tr-md" : "bg-white/[0.03] text-[#e0e0e0] border border-white/[0.05] rounded-tl-md"}`}>
                      <MsgContent text={m.content} />
                      {m.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(m.content, m.id)}
                          className="absolute -right-2 -top-2 w-6 h-6 rounded-md bg-white/10 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Salin"
                        >
                          {copiedId === m.id ? <Check size={12} className="text-[#2DCB85]" /> : <Copy size={12} className="text-white/50" />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2DCB85]/20 to-[#1FA86B]/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-[#2DCB85]" />
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#2DCB85]/50"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Quick Commands */}
            {msgs.length <= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="px-4 pb-3">
                <p className="text-xs text-[#666680] mb-2">Perintah cepat:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_COMMANDS.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.command}
                        onClick={() => send(cmd.command)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-[#2DCB85]/30 hover:bg-[#2DCB85]/5 text-xs text-[#8888aa] hover:text-[#2DCB85] transition-all"
                      >
                        <Icon size={14} />
                        {cmd.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] focus-within:border-[#2DCB85]/30 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder="Ketik /cek <url> atau pertanyaan..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#555570] outline-none"
                  maxLength={500}
                  disabled={typing}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2DCB85]/10 text-[#2DCB85] hover:bg-[#2DCB85]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Kirim"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-[#555570]">
                <CornerDownLeft size={10} />
                Enter untuk kirim
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
