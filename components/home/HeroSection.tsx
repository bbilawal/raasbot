"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaExplore: string;
  ctaShop: string;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  };
}

export function HeroSection({
  title,
  subtitle,
  ctaExplore,
  ctaShop,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      aria-label="Hero"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A] z-10" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #0066FF 0%, transparent 70%)",
          }}
        />
        {/* Video — swap src when ready */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <motion.div {...fadeUpProps(0)}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 text-[#0066FF] text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            Intelligent Robotics
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUpProps(0.1)}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6"
        >
          {title.split(" ").map((word, i) => (
            <span
              key={i}
              className={
                word === "Intelligent" || word === "intelligente"
                  ? "text-[#0066FF]"
                  : ""
              }
            >
              {word}{" "}
            </span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUpProps(0.2)}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUpProps(0.3)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/solutions/humanoid"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0066FF]/20"
          >
            {ctaExplore}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            <ShoppingBag size={16} />
            {ctaShop}
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
