"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "lucide-react";

const codeExample = `// Contoh penggunaan API CekLink
const response = await fetch(
  'https://ceklink.id/api/check?url=https://example.com'
);
const data = await response.json();

console.log(data);
// {
//   "status": "safe",
//   "score": 95,
//   "domain": "example.com",
//   "issues": []
// }`;

const steps = [
  { num: 1, title: "Dapatkan API Key", desc: "Daftar gratis untuk mendapatkan API key unik" },
  { num: 2, title: "Kirim Request", desc: "Kirim GET request dengan parameter URL" },
  { num: 3, title: "Terima Hasil", desc: "Dapatkan status, skor, dan detail analisis dalam JSON" },
];

const specs = [
  { label: "Rate Limit", value: "100 req/hari (gratis)" },
  { label: "Format", value: "JSON" },
  { label: "Metode", value: "GET" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function APISection() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = codeExample;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="api" className="py-16 sm:py-24" aria-label="API publik">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Link size={28} className="text-[#00ff88]" aria-hidden="true" />
            </motion.div>
            API Publik
          </h2>
          <p className="text-[#666680]">
            Integrasikan fitur CekLink ke aplikasi kamu
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Info */}
          <motion.div
            variants={itemVariants}
            className="glass-card p-6 sm:p-8"
          >
            <h3 className="font-heading font-semibold text-lg mb-4 text-[#e0e0e0]">
              Mulai dalam 3 Langkah
            </h3>
            <ol className="space-y-4 text-sm text-[#666680]">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                >
                  <motion.span
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-bold flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(0, 255, 136, 0.2)" }}
                  >
                    {step.num}
                  </motion.span>
                  <span>
                    <strong className="text-[#e0e0e0]">{step.title}</strong>
                    <br />
                    {step.desc}
                  </span>
                </motion.li>
              ))}
            </ol>

            <motion.div
              className="mt-6 pt-4 border-t border-[#1a1a2e]/30"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {specs.map((spec, i) => (
                <div key={i} className={`flex items-center justify-between text-sm ${i > 0 ? "mt-2" : ""}`}>
                  <span className="text-[#666680]">{spec.label}</span>
                  <motion.span
                    className="font-mono text-[#00ff88]"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {spec.value}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Code Example */}
          <motion.div
            variants={itemVariants}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff3b3b]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[#ffaa00]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[#00ff88]" aria-hidden="true" />
              </div>
              <motion.button
                onClick={handleCopy}
                className="text-xs text-[#666680] hover:text-[#00ff88] transition-colors"
                aria-label="Salin kode"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "✓ Tersalin" : "Salin"}
              </motion.button>
            </div>
            <motion.pre
              className="p-4 sm:p-6 overflow-x-auto text-sm font-mono leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <code className="text-[#666680]">
                <span className="text-[#00ff88]">{"// Contoh penggunaan API CekLink"}</span>
                {"\n"}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-[#e0e0e0]">response</span> ={" "}
                <span className="text-purple-400">await</span>{" "}
                <span className="text-blue-400">fetch</span>({"\n"}
                {"  "}<span className="text-[#ffaa00]">{"'https://ceklink.id/api/check?url=https://example.com'"}</span>
                {");"}{"\n"}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-[#e0e0e0]">data</span> ={" "}
                <span className="text-purple-400">await</span>{" "}
                <span className="text-[#e0e0e0]">response</span>.
                <span className="text-blue-400">json</span>();{"\n\n"}
                <span className="text-[#e0e0e0]">console</span>.
                <span className="text-blue-400">log</span>({" "}
                <span className="text-[#e0e0e0]">data</span> );{"\n"}
                <span className="text-[#00ff88]">{"// {"}</span>{"\n"}
                <span className="text-[#00ff88]">{'//   "status": "safe",'}</span>{"\n"}
                <span className="text-[#00ff88]">{'//   "score": 95,'}</span>{"\n"}
                <span className="text-[#00ff88]">{'//   "domain": "example.com",'}</span>{"\n"}
                <span className="text-[#00ff88]">{'//   "issues": []'}</span>{"\n"}
                <span className="text-[#00ff88]">{"// }"}</span>
              </code>
            </motion.pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
