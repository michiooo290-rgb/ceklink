import { ContainerScroll } from "./ContainerScroll";

const CHECKS = [
  { label: "SSL / HTTPS", value: "Terenkripsi" },
  { label: "Domain Terpercaya", value: "Terverifikasi" },
  { label: "Database Ancaman", value: "Bersih" },
  { label: "Reputasi Domain", value: "Baik" },
];

function ScanMockup() {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#0a0a16] to-[#12122a] text-left">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#E55C30]" />
        <span className="h-3 w-3 rounded-full bg-[#F5A623]" />
        <span className="h-3 w-3 rounded-full bg-[#2DCB85]" />
        <div className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
          urlveil.id/analisis
        </div>
      </div>

      <div className="flex-1 p-5 md:p-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#2DCB85]/25 md:h-28 md:w-28">
            <div className="absolute inset-0 rotate-45 rounded-full border-4 border-[#2DCB85] border-b-transparent border-r-transparent" />
            <span className="font-heading text-2xl font-bold text-[#2DCB85] md:text-4xl">96</span>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#2DCB85]/10 px-3 py-1 text-sm font-semibold text-[#2DCB85]">
              AMAN
            </span>
            <p className="mt-2 break-all font-mono text-sm text-slate-200 md:text-base">
              https://tokopedia.com
            </p>
            <p className="mt-1 text-xs text-slate-400 md:text-sm">
              Link ini terlihat aman untuk dikunjungi.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-8">
          {CHECKS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <span className="text-xs text-slate-300 md:text-sm">{item.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#2DCB85] md:text-sm">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScrollShowcase() {
  return (
    <section className="relative">
      <ContainerScroll
        titleComponent={
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/70">
              Lihat langsung
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white md:text-5xl">
              Hasil scan yang jelas dan mudah dipahami
            </h2>
          </div>
        }
      >
        <ScanMockup />
      </ContainerScroll>
    </section>
  );
}
