"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Star, Shield, Users } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const VALUES = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We challenge conventional thinking and embrace bold ideas. Every member of our team is empowered to experiment, iterate, and push the boundaries of what is possible in robotics.",
    color: "#0066FF",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We hold ourselves to the highest standards in engineering, design, and customer experience. Good enough is never good enough — we strive to build the best.",
    color: "#7C3AED",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We act with transparency, honesty, and accountability. Our relationships with customers, partners, and employees are built on trust earned through consistent, ethical behavior.",
    color: "#059669",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Breakthroughs happen when diverse minds work together. We cultivate an inclusive environment where every voice is heard and the best ideas win regardless of seniority.",
    color: "#DC2626",
  },
];

const CULTURE_SECTIONS = [
  {
    title: "Inclusive by Design",
    description:
      "Our team spans 40+ nationalities across offices in Canada, the US, UK, Germany, Japan, and Singapore. We believe diverse perspectives produce better robotics.",
    stat: "40+",
    statLabel: "Nationalities",
  },
  {
    title: "Continuous Learning",
    description:
      "Every employee receives an annual learning budget and access to our internal AI/Robotics Academy. We invest in people because people build the future.",
    stat: "200h",
    statLabel: "Avg. Training Per Year",
  },
  {
    title: "Mission-Driven Work",
    description:
      "We attract people who want their work to matter. From a healthcare robot that helps an elderly resident to an education platform that sparks a child's love of science.",
    stat: "95%",
    statLabel: "Employee Purpose Score",
  },
];

export function CultureContent() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" });

  const sectionsRef = useRef<HTMLDivElement>(null);
  const sectionsInView = useInView(sectionsRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Values Grid */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Core Values
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What We Stand For
            </h2>
          </motion.div>

          <div ref={valuesRef} className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 28 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="group p-8 rounded-2xl border border-white/8 bg-[#111111] hover:border-white/15 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${value.color}18` }}
                  >
                    <Icon size={22} style={{ color: value.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture Sections */}
      <section className="py-24 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Life at Raasbot
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              An Environment Built for Great Work
            </h2>
          </motion.div>

          <div ref={sectionsRef} className="grid md:grid-cols-3 gap-8">
            {CULTURE_SECTIONS.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 28 }}
                animate={sectionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <div className="text-5xl font-bold text-[#0066FF] mb-1">
                  {section.stat}
                </div>
                <div className="text-xs text-white/30 uppercase tracking-widest mb-6">
                  {section.statLabel}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {section.title}
                </h3>
                <p className="text-white/55 leading-relaxed text-sm">
                  {section.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image placeholder grid */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-10"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Our Spaces
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white tracking-tight">
              Where We Work and Create
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className={`rounded-2xl bg-[#111111] border border-white/8 overflow-hidden ${
                  i === 0 ? "col-span-2 row-span-2 h-72 lg:h-auto" : "h-40"
                }`}
              >
                <div
                  className="w-full h-full opacity-[0.04]"
                  style={{
                    backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                  aria-label="Image placeholder"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
