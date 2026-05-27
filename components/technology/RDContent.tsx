"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, FlaskConical, Link2, Users } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STATS = [
  { value: "400+", label: "R&D Engineers" },
  { value: "500+", label: "Granted Patents" },
  { value: "120+", label: "Publications" },
  { value: "25+", label: "University Partners" },
];

const RESEARCH_AREAS = [
  {
    icon: FlaskConical,
    title: "Embodied AI",
    description:
      "We research how AI agents can learn through physical interaction with the world — developing reinforcement learning methods that transfer from simulation to real-world robotic deployment.",
  },
  {
    icon: BookOpen,
    title: "Multimodal Perception",
    description:
      "Combining visual, auditory, tactile, and proprioceptive inputs into a unified world model that enables our robots to understand complex, dynamic environments with human-level situational awareness.",
  },
  {
    icon: Users,
    title: "Human-Robot Interaction",
    description:
      "Understanding the social, emotional, and cognitive dimensions of how people relate to robots — and designing systems that are intuitive, trustworthy, and genuinely useful companions.",
  },
  {
    icon: Link2,
    title: "Neuromorphic Computing",
    description:
      "Exploring brain-inspired computing architectures to dramatically reduce power consumption for on-device AI inference — a key enabler of truly autonomous, battery-powered robotics.",
  },
];

const LABS = [
  {
    name: "Perception Lab",
    location: "Milton, Ontario",
    focus: "Computer vision, 3D sensing, and sensor fusion",
    headcount: 80,
  },
  {
    name: "Motion & Control Lab",
    location: "San Jose, California",
    focus: "Whole-body motion planning, actuator development, and balance systems",
    headcount: 65,
  },
  {
    name: "AI Research Lab",
    location: "Cambridge, United Kingdom",
    focus: "Foundation models, embodied AI, and multimodal learning",
    headcount: 55,
  },
  {
    name: "Human-Robot Interaction Lab",
    location: "Tokyo, Japan",
    focus: "Social robotics, affective computing, and UX for robots",
    headcount: 40,
  },
];

const PARTNERSHIPS = [
  "University of Toronto",
  "MIT CSAIL",
  "ETH Zurich",
  "Carnegie Mellon University",
  "University of British Columbia",
  "Osaka University",
  "Imperial College London",
  "National Research Council Canada",
];

export function RDContent() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const labsRef = useRef<HTMLDivElement>(null);
  const labsInView = useInView(labsRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Stats */}
      <section
        ref={statsRef}
        className="bg-[#111111] border-y border-white/5 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-4xl font-bold text-[#0066FF]">
                  {stat.value}
                </span>
                <span className="text-sm text-white/40">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
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
              Research Focus
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Active Research Programs
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {RESEARCH_AREAS.map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="p-8 rounded-2xl border border-white/8 bg-[#111111] flex gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#0066FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {area.title}
                    </h3>
                    <p className="text-sm text-white/55 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Labs */}
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
              Global Labs
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              R&D Facilities Around the World
            </h2>
          </motion.div>

          <div ref={labsRef} className="grid sm:grid-cols-2 gap-5">
            {LABS.map((lab, i) => (
              <motion.div
                key={lab.name}
                initial={{ opacity: 0, y: 24 }}
                animate={labsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="p-6 rounded-2xl border border-white/8 bg-[#0A0A0A]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lab.name}
                    </h3>
                    <p className="text-xs text-[#0066FF] mt-1">
                      {lab.location}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-white/20">
                    {lab.headcount}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {lab.focus}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Partnerships */}
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
              Academic Partners
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Collaborating with the World's Best Researchers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNERSHIPS.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="px-4 py-5 rounded-xl border border-white/8 bg-[#111111] flex items-center justify-center text-center"
              >
                <span className="text-sm text-white/60 font-medium leading-snug">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
