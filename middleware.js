import { NextResponse } from "next/server";

/**
 * Middleware ini generate "nonce" acak untuk setiap request, lalu pasang
 * di header CSP. Cuma <script> yang punya nonce yang cocok yang boleh
 * dijalankan browser — jadi kalau ada script jahat disuntik (XSS), browser
 * akan blokir karena nonce-nya nggak match.
 *
 * 'strict-dynamic' mengizinkan script yang dimuat OLEH script ber-nonce
 * (misal Next.js memuat chunk JS-nya sendiri secara dinamis) tetap dipercaya,
 * tanpa perlu nonce di setiap chunk satu-satu.
 */
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = [
    "default-src 'self'",
    // 'unsafe-eval' cuma dipakai di dev (dibutuhkan Next.js dev server / HMR),
    // dihilangkan otomatis di production build.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    // Jalankan di semua route KECUALI file statis & gambar, biar nggak nambah overhead
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};