export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1e2e]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#2e3348]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F5A623] animate-spin" />
        </div>
        <p className="text-[#666680] text-sm font-medium">Memuat...</p>
      </div>
    </div>
  );
}
