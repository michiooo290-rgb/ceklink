"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, ShieldAlert, ShieldX, Trash2, Inbox, Search, AlertTriangle, X,
} from "lucide-react";
import { createClient } from "../lib/supabase/client";

const STATUS_STYLE = {
  safe: { icon: ShieldCheck, color: "#2DCB85", bg: "rgba(45,203,133,0.1)" },
  warn: { icon: ShieldAlert, color: "#F5A623", bg: "rgba(245,166,35,0.1)" },
  danger: { icon: ShieldX, color: "#E55C30", bg: "rgba(229,92,48,0.1)" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Empty state — ditampilkan kalau user belum pernah scan ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <Inbox size={28} className="text-[#666680]" />
      </div>
      <h3 className="text-white font-semibold mb-1.5">Belum ada riwayat scan</h3>
      <p className="text-sm text-[#8888aa] max-w-sm mb-6">
        Setiap link yang kamu cek akan otomatis tersimpan di sini selama kamu sedang login.
      </p>
      <a
        href="/#cek-link"
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#F5A623] to-[#2DCB85] text-[#1a1e2e] hover:shadow-[0_0_24px_rgba(245,166,35,0.3)] transition-all"
      >
        <Search size={16} />
        Cek link pertamamu
      </a>
    </div>
  );
}

export default function HistoryList({ initialHistory, userId }) {
  const [history, setHistory] = useState(initialHistory);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const supabase = createClient();

  const handleDelete = async (id) => {
    setDeletingId(id);
    setConfirmId(null);
    const { error } = await supabase.from("scan_history").delete().eq("id", id).eq("user_id", userId);
    if (!error) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
    setDeletingId(null);
  };

  if (history.length === 0) return <EmptyState />;

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {history.map((item) => {
          const style = STATUS_STYLE[item.status] || STATUS_STYLE.warn;
          const Icon = style.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: style.bg }}
              >
                <Icon size={18} style={{ color: style.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-[#e0e0e0] truncate">{item.url}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#666680]">
                  <span style={{ color: style.color }} className="font-medium">
                    {item.status_label}
                  </span>
                  <span>·</span>
                  <span>Skor {item.score}/95</span>
                  <span>·</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>

              <button
                onClick={() => setConfirmId(item.id)}
                disabled={deletingId === item.id}
                aria-label="Hapus riwayat"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#666680] hover:text-[#E55C30] hover:bg-[rgba(229,92,48,0.08)] transition-colors disabled:opacity-40 flex-shrink-0"
              >
                {deletingId === item.id
                  ? <span className="w-3.5 h-3.5 border-2 border-[#E55C30]/30 border-t-[#E55C30] rounded-full animate-spin" />
                  : <Trash2 size={15} />}
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    {/* Confirm delete modal */}
    {confirmId && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: "rgba(10,12,20,0.7)", backdropFilter: "blur(4px)" }}
        onClick={() => setConfirmId(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl border p-6"
          style={{
            background: "rgba(26,30,46,0.98)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(229,92,48,0.1)" }}>
              <AlertTriangle size={18} style={{ color: "#E55C30" }} />
            </div>
            <h3 className="text-base font-semibold text-white">Hapus riwayat ini?</h3>
          </div>
          <p className="text-sm text-[#8888aa] mb-5 ml-12">
            Riwayat scan ini akan dihapus permanen dan tidak bisa dikembalikan.
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setConfirmId(null)}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl text-[#8888aa] hover:text-white hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => handleDelete(confirmId)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all"
              style={{ background: "linear-gradient(135deg, #E55C30, #c4441f)" }}
            >
              Ya, Hapus
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
    </div>
  );
}