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
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cyber-bg text-cyber-text font-body antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
