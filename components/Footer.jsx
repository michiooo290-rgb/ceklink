import Image from "next/image";

const LINKS = [
  {
    title: "Fitur",
    links: [
      { label: "Cek URL", href: "#cek-link" },
      { label: "Database Phising", href: "#database" },
      { label: "Edukasi", href: "#edukasi" },
      { label: "Cara Kerja", href: "#cara-kerja" },
    ],
  },
  {
    title: "Tentang",
    links: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Open Source",
    links: [
      { label: "GitHub", href: "https://github.com/michiooo290-rgb/ceklink", external: true },
      { label: "Dokumentasi API", href: "/#cara-kerja" },
      { label: "Kontribusi", href: "https://github.com/michiooo290-rgb/ceklink/blob/main/CONTRIBUTING.md", external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-root" role="contentinfo">
      <div className="footer-inner">
        {/* Top row */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#beranda" className="footer-logo">
              <Image src="/logo.png" alt="Urlveil" width={100} height={32} className="object-contain" />
            </a>
            <p className="footer-tagline">
              Periksa link sebelum klik.<br />Gratis, tanpa daftar.
            </p>
          </div>

          {/* Links */}
          <div className="footer-cols">
            {LINKS.map((section) => (
              <div key={section.title} className="footer-col">
                <p className="footer-col-title">{section.title}</p>
                <ul className="footer-col-list">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="footer-link"
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}{link.external && <span aria-hidden="true"> ↗</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">© {year} Urlveil · Privacy-First · Open Source</p>
          <p className="footer-made">Made by <span className="footer-author">Michio</span></p>
        </div>
      </div>
    </footer>
  );
}