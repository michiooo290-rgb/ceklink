import { redirect } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import FloatingHeader from "../../components/FloatingHeader";
import Footer from "../../components/Footer";
import HistoryList from "../../components/HistoryList";

export const metadata = {
  title: "Riwayat Scan — Urlveil",
  description: "Riwayat link yang sudah kamu periksa di Urlveil.",
};

export default async function RiwayatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/riwayat");
  }

  const { data: history } = await supabase
    .from("scan_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen pt-28 pb-20" style={{ background: "var(--color-paper)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#666680] hover:text-[#F5A623] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </a>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245,166,35,0.1)" }}
            >
              <History size={18} className="text-[#F5A623]" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white">Riwayat Scan</h1>
          </div>
          <p className="text-sm text-[#8888aa] mb-8">
            Daftar link yang sudah kamu periksa, terbaru di atas.
          </p>

          <HistoryList initialHistory={history || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}