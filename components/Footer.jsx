"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const footerLinks = [
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

  return (
    <footer className="border-t border-[#2e3348] py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <a
              href="#beranda"
              className="flex items-center gap-2 font-heading font-bold text-xl text-[#2DCB85] mb-3"
            >
              <ShieldCheck size={20} aria-hidden="true" />
              Urlveil
            </a>
            <p className="text-[#666680] text-sm leading-relaxed">
              Lindungi diri dan keluarga dari ancaman phising. Cek link sebelum
              mengklik.
            </p>
          </motion.div>

          {/* Link Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={itemVariants}>
              <h3 className="font-heading font-semibold text-sm text-[#e0e0e0] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-[#666680] text-sm hover:text-[#2DCB85] transition-colors inline-block"
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block ml-1 text-[#555570]">↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Bottom */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666680]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>
            © {currentYear} Urlveil. Privacy-First. Open Source.
          </p>
          <p className="flex items-center gap-1">
            Made with care by{" "}
            <span className="text-[#2DCB85] font-medium">Michio</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
