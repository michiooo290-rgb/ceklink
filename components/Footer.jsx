"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Heart } from "lucide-react";

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
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
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
        { label: "API", href: "#api" },
      ],
    },
    {
      title: "Tentang",
      links: [
        { label: "Tentang Kami", href: "#beranda" },
        { label: "Kebijakan Privasi", href: "#beranda" },
        { label: "Syarat & Ketentuan", href: "#beranda" },
        { label: "Kontak", href: "#beranda" },
      ],
    },
    {
      title: "Open Source",
      links: [
        { label: "GitHub", href: "https://github.com", external: true },
        { label: "Dokumentasi API", href: "#api" },
        { label: "Kontribusi", href: "#api" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#1a1a2e] py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="#beranda"
              className="flex items-center gap-2 font-heading font-bold text-xl text-[#00ff88] mb-3"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <ShieldCheck size={20} aria-hidden="true" />
              </motion.div>
              CekLink
            </motion.a>
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
              <motion.ul
                className="space-y-2"
                variants={containerVariants}
              >
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} variants={linkVariants}>
                    <motion.a
                      href={link.href}
                      className="text-[#666680] text-sm hover:text-[#00ff88] transition-colors inline-block"
                      whileHover={{ x: 4, color: "#00ff88" }}
                      transition={{ duration: 0.2 }}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link.label}
                      {link.external && (
                        <span className="inline-block ml-1 text-[#555570]">↗</span>
                      )}
                    </motion.a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="section-divider mb-6"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Bottom */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666680]"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p>
            © {currentYear} CekLink. Privacy-First. Open Source.
          </p>
          <motion.p
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart size={14} className="text-[#ff3b3b] fill-[#ff3b3b]" aria-hidden="true" />
            </motion.span>{" "}
            by{" "}
            <span className="text-[#00ff88] font-medium">Michio Tarok</span>
            {" · "}Rekayasa Keamanan Siber
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
