import "./globals.css";

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-cyber-bg text-cyber-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
