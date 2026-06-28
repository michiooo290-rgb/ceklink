import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware ini melakukan DUA hal di setiap request:
 *
 * 1. Generate "nonce" acak untuk CSP — cuma <script> yang nonce-nya cocok
 *    yang boleh dijalankan browser (lihat penjelasan lengkap di bawah).
 * 2. Refresh session login Supabase (kalau ada cookie auth yang mau expired,
 *    di-refresh otomatis di sini supaya user nggak ke-logout tiba-tiba).
 */
export async function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const cspHeader = [
    "default-src 'self'",
    // 'unsafe-eval' cuma dipakai di dev (dibutuhkan Next.js dev server / HMR),
    // dihilangkan otomatis di production build.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    // Supabase auth/API dipanggil langsung dari browser, jadi domain-nya
    // perlu diizinkan di connect-src.
    `connect-src 'self' ${supabaseUrl}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", cspHeader);

  // ── Refresh session Supabase ──────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          response.headers.set("Content-Security-Policy", cspHeader);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // WAJIB dipanggil — ini yang memicu refresh token kalau perlu.
  // Jangan dihapus / dipindah, dan jangan ditaruh logic di antara
  // createServerClient() dan getUser() (lihat docs Supabase).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Jalankan di semua route KECUALI file statis & gambar, biar nggak nambah overhead
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};