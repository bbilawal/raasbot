"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type NavHref = ComponentProps<typeof Link>["href"];

interface SolutionCard {
  key: string;
  label: string;
  description: string;
  href: NavHref;
  icon: string;
}

interface SolutionsGridProps {
  title: string;
  cards: SolutionCard[];
}

export function SolutionsGrid({ title, cards }: SolutionsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="py-24 bg-[#0A0A0A]"
      aria-labelledby="solutions-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
            Solutions
          </span>
          <h2
            id="solutions-heading"
            className="text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight"
          >
            {title}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            >
              <Link
                href={card.href}
                className="group relative flex flex-col justify-between h-full min-h-[220px] p-7 rounded-2xl border border-white/8 bg-[#111111] hover:bg-[#161616] hover:border-[#0066FF]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#0066FF]/5"
                aria-label={card.label}
              >
                {/* Icon */}
                <div
                  className="text-4xl mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-[#0066FF]/10 group-hover:bg-[#0066FF]/20 transition-colors"
                  aria-hidden="true"
                >
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#0066FF] transition-colors">
                    {card.label}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-5 flex justify-end">
                  <ArrowUpRight
                    size={18}
                    className="text-white/20 group-hover:text-[#0066FF] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
