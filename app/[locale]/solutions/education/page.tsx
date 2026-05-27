"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Link } from "@/i18n/navigation";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Lightbulb,
  Code2,
  ShoppingBag,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, GraduationCap, Users, Award, Lightbulb, Code2,
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const K12_PRODUCTS = [
  {
    name: "Alpha Mini 2 Education",
    tagline: "The Classroom Companion",
    description:
      "A small, friendly robot designed specifically for K-12 classrooms. Comes with a full curriculum package covering STEM, coding, and social-emotional learning.",
    features: ["Pre-loaded lesson plans", "Block-based and Python coding", "Age 6-18 appropriate"],
  },
  {
    name: "Education Suite Platform",
    tagline: "Teacher-First Learning Management",
    description:
      "A cloud-based platform that manages robot fleets, tracks student progress, and provides teachers with pre-built lesson plans aligned to national curricula.",
    features: ["Class management dashboard", "Progress analytics", "Curriculum builder"],
  },
  {
    name: "STEM Lab Kit",
    tagline: "Hands-On STEM Discovery",
    description:
      "Complete lab kit with modular robots, sensors, and experiment guides designed to teach physics, electronics, and programming through hands-on discovery.",
    features: ["40+ experiments", "Team-based challenges", "Assessment tools"],
  },
];

const HIGHER_ED_PRODUCTS = [
  {
    name: "Walker X Research Edition",
    tagline: "University Research Platform",
    description:
      "Full humanoid platform with open APIs, digital twin simulation, and ROS2 support for advanced robotics research programs.",
    features: ["Full joint-level API", "Digital twin included", "ROS2 & ROS support"],
  },
  {
    name: "Vocational Training Suite",
    tagline: "Industry-Ready Robotics Training",
    description:
      "A comprehensive training system for vocational and technical schools covering industrial robotics, automation programming, and maintenance.",
    features: ["Industry-aligned curriculum", "Certification prep", "Simulation software"],
  },
  {
    name: "Robotics Lab Platform",
    tagline: "Complete University Lab Setup",
    description:
      "A multi-robot lab environment with fleet management, collaborative research tools, and instructor management software for higher education.",
    features: ["Multi-robot coordination", "Research publication tools", "Lab booking system"],
  },
];

const K12_USE_CASES = [
  { iconName: 'Code2', title: "Coding & Programming", description: "Block-based to Python progression, teaching computational thinking from age 6." },
  { iconName: 'Lightbulb', title: "STEM Discovery", description: "Hands-on experiments that bring physics, math, and engineering to life." },
  { iconName: 'Users', title: "Social-Emotional Learning", description: "Robots as empathy-building tools for collaborative classroom activities." },
];

const HIGHER_ED_USE_CASES = [
  { iconName: 'GraduationCap', title: "Robotics Research", description: "Open platforms supporting peer-reviewed research publication." },
  { iconName: 'Award', title: "Certification Programs", description: "Industry-aligned certifications for engineering and automation careers." },
  { iconName: 'BookOpen', title: "Interdisciplinary Learning", description: "Connecting robotics to healthcare, logistics, and social sciences curricula." },
];

function ProductCard({ product, index }: { product: typeof K12_PRODUCTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="flex flex-col p-7 rounded-2xl border border-white/8 bg-[#111111] hover:border-[#0066FF]/20 transition-all duration-300"
    >
      <div className="h-36 rounded-xl bg-[#0A0A0A] border border-white/5 mb-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`, backgroundSize: "30px 30px" }} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{product.name}</h3>
      <p className="text-sm text-[#0066FF]/80 font-medium mb-3">{product.tagline}</p>
      <p className="text-sm text-white/50 leading-relaxed flex-1 mb-5">{product.description}</p>
      <ul className="flex flex-col gap-1.5 mb-5">
        {product.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-white/50">
            <span className="w-1 h-1 rounded-full bg-[#0066FF]" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF]/10 hover:bg-[#0066FF]/20 text-[#0066FF] text-sm font-semibold transition-colors">
        <ShoppingBag size={14} />
        View in Shop
      </Link>
    </motion.div>
  );
}

function UseCaseCard({ uc, index }: { uc: typeof K12_USE_CASES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = ICON_MAP[uc.iconName] ?? BookOpen;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="p-6 rounded-xl border border-white/8 bg-[#0A0A0A]"
    >
      <div className="w-10 h-10 rounded-lg bg-[#0066FF]/10 flex items-center justify-center mb-4">
        <Icon size={18} className="text-[#0066FF]" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{uc.title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{uc.description}</p>
    </motion.div>
  );
}

function TabContent({ tab }: { tab: "k12" | "higher" }) {
  const products = tab === "k12" ? K12_PRODUCTS : HIGHER_ED_PRODUCTS;
  const useCases = tab === "k12" ? K12_USE_CASES : HIGHER_ED_USE_CASES;

  return (
    <>
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p, i) => <ProductCard key={p.name} product={p} index={i} />)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Use Cases</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-5">
            {useCases.map((uc, i) => <UseCaseCard key={uc.title} uc={uc} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<"k12" | "higher">("k12");

  return (
    <>
      <PageHero
        eyebrow="Solutions — Education"
        title="AI Education Solutions for Every Level"
        subtitle="From primary school classrooms to university research labs — Raasbot makes robotics education accessible, engaging, and career-ready."
      />

      {/* Tab switcher */}
      <section className="bg-[#0A0A0A] pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex rounded-xl border border-white/10 bg-[#111111] p-1">
            <button
              onClick={() => setActiveTab("k12")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "k12"
                  ? "bg-[#0066FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              K-12 Education
            </button>
            <button
              onClick={() => setActiveTab("higher")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "higher"
                  ? "bg-[#0066FF] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Vocational & Higher Education
            </button>
          </div>
        </div>
      </section>

      <TabContent tab={activeTab} />

      {/* CTA */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Bring Robotics into Your Institution
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              We offer educational pricing, curriculum support, and dedicated onboarding for schools and universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-[#0066FF]/20">
                Request a Demo
                <ArrowRight size={15} />
              </Link>
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02]">
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
