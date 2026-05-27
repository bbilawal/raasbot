"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
import { Link } from "@/i18n/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  title: string;
  buyNow: string;
  getQuote: string;
}

const PLACEHOLDER_PRODUCTS = [
  {
    id: "rb-h1",
    name: "Raasbot H1",
    category: "Humanoid",
    price: "Contact for pricing",
    badge: "Flagship",
    specs: ["180cm height", "50kg payload", "8h battery life"],
  },
  {
    id: "rb-edu",
    name: "EduBot Pro",
    category: "AI Education",
    price: "Starting from $4,999",
    badge: "Best Seller",
    specs: ["K-12 curriculum", "Multi-language AI", "Classroom ready"],
  },
  {
    id: "rb-log",
    name: "LogiBot X3",
    category: "Logistics",
    price: "Starting from $19,999",
    badge: "New",
    specs: ["200kg capacity", "Autonomous nav", "24/7 operation"],
  },
] as const;

const BADGE_COLORS: Record<string, string> = {
  Flagship: "bg-[#0066FF]/20 text-[#0066FF] border-[#0066FF]/30",
  "Best Seller": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  New: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function FeaturedProducts({
  title,
  buyNow,
  getQuote,
}: FeaturedProductsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-24 bg-[#0A0A0A]"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-14 flex-wrap gap-4"
        >
          <div>
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Products
            </span>
            <h2
              id="products-heading"
              className="text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight"
            >
              {title}
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors group"
          >
            View all
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLACEHOLDER_PRODUCTS.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: EASE,
              }}
              className="group relative flex flex-col rounded-2xl border border-white/8 bg-[#111111] overflow-hidden hover:border-[#0066FF]/20 transition-all duration-300"
              aria-label={product.name}
            >
              {/* Product image placeholder */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#161616] to-[#0F0F0F] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #0066FF 0%, transparent 60%)`,
                  }}
                  aria-hidden="true"
                />
                <div className="text-6xl select-none" aria-hidden="true">
                  🤖
                </div>
                {/* Badge */}
                <span
                  className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    BADGE_COLORS[product.badge] ??
                    "bg-white/10 text-white/60 border-white/10"
                  }`}
                >
                  {product.badge}
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest mb-1.5">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#0066FF] transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Specs */}
                <ul className="flex flex-col gap-1.5 mb-6" role="list">
                  {product.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-2 text-xs text-white/50"
                    >
                      <span
                        className="w-1 h-1 rounded-full bg-[#0066FF]/60 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {spec}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-white/80 mb-4">
                    {product.price}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href="/shop"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <ShoppingCart size={13} />
                      {buyNow}
                    </Link>
                    <Link
                      href="/about/contact"
                      className="flex-1 flex items-center justify-center py-2.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {getQuote}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
