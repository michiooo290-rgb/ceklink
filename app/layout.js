import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata = {
  title: "CekLink — Cek Keamanan Link",
  description:
    "Tempel link yang mencurigakan, kami akan menganalisisnya dalam hitungan detik. Lindungi diri dari phising dan malware.",
  keywords: "cek link, phising, keamanan, URL checker, cek phising indonesia",
  openGraph: {
    title: "CekLink — Cek Keamanan Link",
    description: "Tempel link, tahu aman atau bahaya. Gratis!",
    type: "website",
    url: "https://ceklink.id",
    siteName: "CekLink",
    images: [
      {
        url: "https://ceklink.id/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CekLink — Cek Keamanan Link",
        type: "image/svg+xml",
      },
    ],
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <meta name="theme-color" content="#1a1e2e" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CekLink — Cek Keamanan Link" />
        <meta name="twitter:description" content="Tempel link, tahu aman atau bahaya. Gratis!" />
        <meta name="twitter:image" content="https://ceklink.id/og-image.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/og-image.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/og-image.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap"
        />
        <link rel="canonical" href="https://ceklink.id" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "CekLink",
              url: "https://ceklink.id",
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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
