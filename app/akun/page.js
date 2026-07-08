import { redirect } from "next/navigation";
import { ArrowLeft, UserCircle2, Mail, CalendarDays, Gauge, ScanLine } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { getQuotaStatus } from "../../lib/rate-limit";
import { DEEPSCAN_USER_MAX, ONE_DAY_MS, DEEPSCAN_USER_PREFIX } from "../../lib/quota-config";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Akun Saya - Urlveil",
  description: "Profil akun dan sisa kuota Analisis Mendalam kamu di Urlveil.",
};

// Halaman ini baca kuota real-time dari Redis/Upstash, jadi jangan di-cache.
export const dynamic = "force-dynamic";

function formatTanggal(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AkunPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/akun");

  const [{ count: totalScan }, quota] = await Promise.all([
    supabase
      .from("scan_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    getQuotaStatus(
      { max: DEEPSCAN_USER_MAX, windowMs: ONE_DAY_MS, prefix: DEEPSCAN_USER_PREFIX },
      user.id
    ),
  ]);

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Kamu";
  const initial = displayName.charAt(0).toUpperCase();

  const quotaUsed = Math.max(0, quota.limit - quota.remaining);
  const quotaPct = quota.limit > 0 ? Math.min(100, Math.round((quotaUsed / quota.limit) * 100)) : 0;
  const quotaLow = quota.remaining <= Math.ceil(quota.limit * 0.15);

  const PROFILE_ROWS = [
    { icon: UserCircle2, label: "Nama", value: displayName },
    { icon: Mail, label: "Email", value: user.email || "-" },
    { icon: CalendarDays, label: "Bergabung sejak", value: formatTanggal(user.created_at) },
  ];

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
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-xl"
              style={{
                background: "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(45,203,133,0.15))",
                border: "1px solid rgba(245,166,35,0.2)",
                color: "#F5A623",
              }}
            >
              {initial}
            </div>
            <div>
              <span className="font-mono text-xs text-[#555570] uppercase tracking-widest block mb-1">Akun Saya</span>
              <h1 className="font-heading font-bold text-2xl text-white leading-tight">{displayName}</h1>
              <p className="text-sm text-[#8888aa] mt-1">{user.email}</p>
            </div>
          </div>

          {/* Profil */}
          <div
            className="rounded-2xl border p-5 mb-6"
            style={{ background: "rgba(26,30,46,0.5)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555570] mb-4">
              Informasi Profil
            </h2>
            <div className="space-y-4">
              {PROFILE_ROWS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <Icon size={16} className="text-[#8888aa]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#666680]">{label}</div>
                    <div className="text-sm text-[#e0e0e0] truncate">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kuota Analisis Mendalam */}
          <div
            className="rounded-2xl border p-5 mb-6"
            style={{ background: "rgba(26,30,46,0.5)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Gauge size={16} style={{ color: quotaLow ? "#E55C30" : "#2DCB85" }} />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#555570]">
                Kuota Analisis Mendalam Hari Ini
              </h2>
            </div>
            <p className="text-xs text-[#666680] mb-4">
              Reset otomatis tiap 24 jam sejak pemakaian pertama hari ini.
            </p>

            <div className="flex items-end justify-between mb-2">
              <div>
                <span
                  className="font-heading font-bold text-3xl"
                  style={{ color: quotaLow ? "#E55C30" : "#2DCB85" }}
                >
                  {quota.remaining}
                </span>
                <span className="text-sm text-[#666680]"> / {quota.limit} tersisa</span>
              </div>
              <span className="text-xs text-[#666680]">{quotaUsed} sudah dipakai</span>
            </div>

            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${quotaPct}%`,
                  background: quotaLow
                    ? "linear-gradient(90deg, #E55C30, #c4441f)"
                    : "linear-gradient(90deg, #F5A623, #2DCB85)",
                }}
              />
            </div>

            {quotaLow && (
              <p className="text-xs mt-3" style={{ color: "#E55C30" }}>
                Kuota kamu hampir habis. Sisa kuota reset otomatis besok.
              </p>
            )}
          </div>

          {/* Total scan */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(45,203,133,0.08)", border: "1px solid rgba(45,203,133,0.15)" }}
          >
            <ScanLine size={18} style={{ color: "#2DCB85", flexShrink: 0 }} />
            <div>
              <div className="font-heading font-bold text-xl leading-none" style={{ color: "#2DCB85" }}>
                {totalScan || 0}
              </div>
              <div className="text-xs text-[#666680] mt-0.5">Total link pernah discan</div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
