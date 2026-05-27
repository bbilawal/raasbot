"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ShoppingBag, Building2, ShoppingCart, Hotel, Briefcase, Utensils, Shield, GraduationCap, BookOpen, Heart, Truck, Users, Bot, Cpu, Wifi, Package, Home, Activity, Zap, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Building2, ShoppingCart, Hotel, Briefcase, Utensils, Shield,
  GraduationCap, BookOpen, Heart, Truck, Users, Bot, Cpu, Wifi,
  Package, Home, Activity, Zap, ArrowRight, ShoppingBag,
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export type ProductCard = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  features: string[];
  badge?: string;
};

export type UseCaseItem = {
  iconName: string;
  title: string;
  description: string;
};

interface SolutionPageLayoutProps {
  sectionLabel: string;
  intro: string;
  products: ProductCard[];
  useCases: UseCaseItem[];
  ctaTitle: string;
  ctaDesc: string;
}

function ProductCardUI({ product, index }: { product: ProductCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASE }}
      className="flex flex-col h-full p-7 rounded-2xl border border-white/8 bg-[#111111] hover:border-[#0066FF]/20 hover:bg-[#161616] transition-all duration-300 group"
    >
      {/* Category + badge row */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-[#0066FF] font-semibold uppercase tracking-widest">
          {product.category}
        </span>
        {product.badge && (
          <span className="px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#0066FF] text-xs font-semibold">
            {product.badge}
          </span>
        )}
      </div>

      {/* Image placeholder */}
      <div className="h-40 rounded-xl bg-[#0A0A0A] border border-white/5 mb-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
          aria-hidden="true"
        />
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#0066FF] transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-[#0066FF]/80 mb-3 font-medium">
        {product.tagline}
      </p>
      <p className="text-sm text-white/50 leading-relaxed flex-1 mb-5">
        {product.description}
      </p>

      {/* Features */}
      <ul className="flex flex-col gap-1.5 mb-6">
        {product.features.slice(0, 3).map((feat) => (
          <li
            key={feat}
            className="flex items-center gap-2 text-xs text-white/50"
          >
            <span className="w-1 h-1 rounded-full bg-[#0066FF]" aria-hidden="true" />
            {feat}
          </li>
        ))}
      </ul>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF]/10 hover:bg-[#0066FF]/20 text-[#0066FF] text-sm font-semibold transition-colors"
      >
        <ShoppingBag size={14} />
        View in Shop
      </Link>
    </motion.div>
  );
}

export function SolutionPageLayout({
  sectionLabel,
  intro,
  products,
  useCases,
  ctaTitle,
  ctaDesc,
}: SolutionPageLayoutProps) {
  const useCasesRef = useRef<HTMLDivElement>(null);
  const useCasesInView = useInView(useCasesRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Products grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-12"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              {sectionLabel}
            </span>
            <p className="mt-4 text-white/55 max-w-2xl leading-relaxed">
              {intro}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <ProductCardUI key={product.name} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-12"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Use Cases
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white tracking-tight">
              Real-World Applications
            </h2>
          </motion.div>

          <div
            ref={useCasesRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {useCases.map((uc, i) => {
              const Icon = ICON_MAP[uc.iconName] ?? Bot;
              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={useCasesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className="p-6 rounded-xl border border-white/8 bg-[#0A0A0A]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0066FF]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#0066FF]" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {uc.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              {ctaTitle}
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">{ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0066FF]/20"
              >
                Request a Demo
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag size={15} />
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
