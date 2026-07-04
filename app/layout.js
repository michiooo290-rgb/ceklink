import { headers } from "next/headers";
import "./globals.css";
import "./enhancements.css";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastProvider } from "../components/Toast";

export const metadata = {
  title: "Urlveil — Cek Keamanan Link",
  description:
    "Tempel link yang mencurigakan, kami akan menganalisisnya dalam hitungan detik. Lindungi diri dari phising dan malware.",
  keywords: "cek link, phising, keamanan, URL checker, cek phising indonesia",
  openGraph: {
    title: "Urlveil — Cek Keamanan Link",
    description: "Tempel link, tahu aman atau bahaya. Gratis!",
    type: "website",
    url: "https://urlveil.id",
    siteName: "Urlveil",
    images: [
      {
        url: "https://urlveil.id/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Urlveil — Cek Keamanan Link",
        type: "image/svg+xml",
      },
    ],
    locale: "id_ID",
  },
};

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="id" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <meta name="theme-color" content="#0c0f1a" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Urlveil — Cek Keamanan Link" />
        <meta name="twitter:description" content="Tempel link, tahu aman atau bahaya. Gratis!" />
        <meta name="twitter:image" content="https://urlveil.id/og-image.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/og-image.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/og-image.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
        <link rel="canonical" href="https://urlveil.id" />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Urlveil",
              url: "https://urlveil.id",
              description: "Tempel link yang mencurigakan, kami akan menganalisisnya dalam hitungan detik. Lindungi diri dari phising dan malware.",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
              inLanguage: "id",
              author: { "@type": "Person", name: "Michio" },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
