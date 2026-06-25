"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Reveal animations
const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideRightVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const blurVariants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Stagger container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Main wrapper component
export function AnimateOnScroll({
  children,
  variant = "reveal",
  delay = 0,
  className = "",
  once = true,
  amount = 0.3,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const variants = {
    reveal: revealVariants,
    fade: fadeInVariants,
    slideUp: slideUpVariants,
    slideRight: slideRightVariants,
    scale: scaleVariants,
    blur: blurVariants,
  };

  const selectedVariant = variants[variant] || revealVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger list wrapper
export function AnimateStagger({
  children,
  className = "",
  once = true,
  amount = 0.2,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item (use inside AnimateStagger)
export function AnimateStaggerItem({ children, className = "" }) {
  return (
    <motion.div variants={revealVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Counter animation
export function AnimatedCounter({ target, duration = 2000, className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString("id-ID")}
    </span>
  );
}

// Text reveal animation
export function TextReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: "100%" }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect
export function MagneticHover({ children, className = "", strength = 0.3 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glitch text effect
export function GlitchText({ children, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 text-[#00ff88] opacity-0 animate-glitch-1"
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute inset-0 text-[#ff3b3b] opacity-0 animate-glitch-2"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// Typewriter effect
export function Typewriter({ text, speed = 50, delay = 0, className = "" }) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let timeout;
    let currentIndex = 0;

    const startTyping = () => {
      timeout = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timeout);
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timeout);
    };
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {displayText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

// Parallax wrapper
export function Parallax({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      setOffset(scrolled * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: offset }}>
        {children}
      </motion.div>
    </div>
  );
}
