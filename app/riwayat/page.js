import { redirect } from "next/navigation";
import { ArrowLeft, History, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import HistoryList from "../../components/HistoryList";

export const metadata = {
  title: "Riwayat Scan - Urlveil",
  description: "Riwayat link yang sudah kamu periksa di Urlveil.",
};

export default async function RiwayatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/riwayat");

  const { data: history } = await supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const items = history || [];

  // Hitung mini stats di server
  const totalSafe   = items.filter((i) => i.status === "safe").length;
  const totalWarn   = items.filter((i) => i.status === "warn").length;
  const totalDanger = items.filter((i) => i.status === "danger").length;

  const MINI_STATS = [
    { icon: ShieldCheck, value: totalSafe,   label: "Aman",        color: "#2DCB85", bg: "rgba(45,203,133,0.08)",  border: "rgba(45,203,133,0.15)"  },
    { icon: ShieldAlert, value: totalWarn,   label: "Mencurigakan", color: "#F5A623", bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.15)"  },
    { icon: ShieldX,     value: totalDanger, label: "Berbahaya",    color: "#E55C30", bg: "rgba(229,92,48,0.08)",   border: "rgba(229,92,48,0.15)"   },
  ];

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Kamu";

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-3xl mx-auto px-6">

          {/* Back */}
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-10">
            <ArrowLeft size={14} /> Kembali ke Beranda
          </a>

          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.15)" }}
            >
              <History size={20} className="text-[#F5A623]" />
            </div>
            <div>
              <span className="font-mono text-xs text-[#555570] uppercase tracking-widest block mb-1">Riwayat Scan</span>
              <h1 className="font-heading font-bold text-2xl text-white leading-tight">
                {items.length > 0
                  ? `${items.length} link sudah kamu periksa`
                  : "Belum ada riwayat scan"}
              </h1>
              <p className="text-sm text-[#8888aa] mt-1">
                Halo, <span className="text-[#a0a5b8] font-medium">{displayName}</span>. Berikut riwayat terbaru dari yang paling baru.
              </p>
            </div>
          </div>

          {/* Mini stats — hanya tampil kalau ada data */}
          {items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {MINI_STATS.map(({ icon: Icon, value, label, color, bg, border }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon size={18} style={{ color, flexShrink: 0 }} />
                  <div>
                    <div className="font-heading font-bold text-xl leading-none" style={{ color }}>{value}</div>
                    <div className="text-xs text-[#666680] mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List */}
          <HistoryList initialHistory={items} userId={user.id} />

        </div>
      </main>
      <Footer />
    </>
  );
}