"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}

const itemInitial = { opacity: 0, y: -16, scale: 0.96 };
const itemAnimate = { opacity: 1, y: 0, scale: 1 };
const itemExit = { opacity: 0, y: -10, scale: 0.96 };
const itemTransition = { duration: 0.22, ease: "easeOut" };

function toastStyle(type) {
  return {
    background: "rgba(18, 21, 31, 0.92)",
    borderColor: type === "danger" ? "#E55C3055" : "#2DCB8555",
  };
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message, options) => {
      const opts = options || {};
      const type = opts.type || "success";
      const duration = opts.duration || 3500;
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[min(92vw,380px)]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={itemInitial}
              animate={itemAnimate}
              exit={itemExit}
              transition={itemTransition}
              style={toastStyle(t.type)}
              className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur"
              role="status"
            >
              {t.type === "danger" ? (
                <AlertTriangle size={18} className="text-[#E55C30] shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} className="text-[#2DCB85] shrink-0" aria-hidden="true" />
              )}
              <span className="flex-1 text-sm text-[#e0e0e0]">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Tutup notifikasi"
                className="text-[#666680] hover:text-[#e0e0e0] transition-colors"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
