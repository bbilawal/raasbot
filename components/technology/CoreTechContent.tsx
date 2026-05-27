"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Eye,
  Activity,
  MessageSquare,
  Cpu,
  Cloud,
  ShieldAlert,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TECH_PILLARS = [
  {
    id: "ai-vision",
    icon: Eye,
    title: "AI Vision",
    tagline: "See the world like never before",
    description:
      "Our proprietary visual perception stack processes inputs from 6 high-resolution cameras at 30 fps, enabling real-time object recognition, depth mapping, and human pose estimation. The system achieves 99.2% object recognition accuracy across 10,000+ trained categories.",
    specs: [
      "6-camera stereo vision array",
      "99.2% object recognition accuracy",
      "Real-time 3D depth mapping",
      "Human pose & gesture recognition",
      "Night vision with IR illumination",
    ],
    color: "#0066FF",
  },
  {
    id: "motion-control",
    icon: Activity,
    title: "Motion Control",
    tagline: "Fluid, precise, natural movement",
    description:
      "Our motion control system governs 41 degrees of freedom with sub-millisecond actuator response times. Proprietary balance algorithms allow stable bipedal locomotion on uneven terrain, stairs, and dynamic environments — even under external perturbation.",
    specs: [
      "41 degrees of freedom",
      "<1ms actuator response time",
      "Stable on slopes up to 15°",
      "Stair climbing capability",
      "Dynamic balance under 50N push",
    ],
    color: "#7C3AED",
  },
  {
    id: "natural-language",
    icon: MessageSquare,
    title: "Natural Language",
    tagline: "Communicate naturally, act intelligently",
    description:
      "An on-device large language model enables real-time conversational interaction without cloud dependency. The system supports 28 languages, context-aware dialogue, and the ability to translate spoken commands into precise robotic actions.",
    specs: [
      "28 languages supported",
      "On-device LLM inference",
      "Context-aware multi-turn dialogue",
      "Voice + gesture command fusion",
      "<200ms response latency",
    ],
    color: "#059669",
  },
  {
    id: "edge-computing",
    icon: Cpu,
    title: "Edge Computing",
    tagline: "Intelligence at the point of action",
    description:
      "Each robot houses a custom AI SoC delivering 30 TOPS of neural network inference power. All perception, planning, and control runs locally, ensuring reliable operation in environments with no internet connectivity.",
    specs: [
      "30 TOPS custom AI SoC",
      "Fully offline capable",
      "8GB LPDDR5 memory",
      "256GB NVMe storage",
      "Real-time OS with <1ms latency",
    ],
    color: "#DC2626",
  },
  {
    id: "cloud-integration",
    icon: Cloud,
    title: "Cloud Integration",
    tagline: "Scale smarter with connected intelligence",
    description:
      "Our cloud platform enables fleet management, OTA software updates, usage analytics, and remote monitoring for enterprise deployments. The Raasbot API supports integration with ERP, SCADA, and facility management systems.",
    specs: [
      "Fleet management dashboard",
      "OTA software updates",
      "REST & WebSocket API",
      "ERP/SCADA integration",
      "99.9% cloud SLA",
    ],
    color: "#EA580C",
  },
  {
    id: "safety-systems",
    icon: ShieldAlert,
    title: "Safety Systems",
    tagline: "Engineered for safe human coexistence",
    description:
      "Multiple redundant safety layers include force-torque sensing at every joint, proximity detection via ultrasonic and LiDAR sensors, software-enforced speed limits in human-present zones, and a hardware emergency stop accessible on every unit.",
    specs: [
      "Force-torque sensing at all joints",
      "360° proximity detection",
      "Configurable speed zones",
      "Hardware E-stop on every unit",
      "ISO 10218-1 certified",
    ],
    color: "#0891B2",
  },
];

export function CoreTechContent() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Tech pillars grid */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={gridRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {TECH_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              const isActive = activeId === pillar.id;

              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={gridInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                >
                  <button
                    className={`w-full text-left p-7 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "border-[#0066FF]/40 bg-[#0066FF]/5"
                        : "border-white/8 bg-[#111111] hover:border-white/15 hover:bg-[#161616]"
                    }`}
                    onClick={() =>
                      setActiveId(isActive ? null : pillar.id)
                    }
                    aria-expanded={isActive}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${pillar.color}18` }}
                    >
                      <Icon size={22} style={{ color: pillar.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-white/40 mb-4">
                      {pillar.tagline}
                    </p>
                    <p className="text-sm text-white/55 leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Specs — visible when active */}
                    <motion.div
                      initial={false}
                      animate={
                        isActive
                          ? { height: "auto", opacity: 1, marginTop: 16 }
                          : { height: 0, opacity: 0, marginTop: 0 }
                      }
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="border-t border-white/8 pt-4"
                        style={{ borderColor: `${pillar.color}30` }}
                      >
                        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                          Key Specs
                        </p>
                        <ul className="flex flex-col gap-2">
                          {pillar.specs.map((spec) => (
                            <li
                              key={spec}
                              className="flex items-center gap-2 text-xs text-white/60"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: pillar.color }}
                              />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>

                    <div className="mt-4 text-xs font-medium" style={{ color: pillar.color }}>
                      {isActive ? "Show less" : "View specs →"}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform overview */}
      <section className="py-24 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
                Unified Platform
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
                Six Pillars, One Coherent System
              </h2>
              <p className="text-white/55 leading-relaxed mb-6">
                What makes Raasbot technology unique is not any single
                capability, but the way all six pillars integrate. A robot
                that can see, understand, speak, move, compute, and stay
                safe — simultaneously and in real time — produces emergent
                capabilities far beyond the sum of its parts.
              </p>
              <p className="text-white/55 leading-relaxed">
                Our platform is built on open APIs, enabling enterprise
                customers and developers to extend robot behavior, integrate
                with existing systems, and build custom applications on top
                of our proven foundation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="rounded-2xl border border-white/8 bg-[#0A0A0A] p-8"
            >
              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  { value: "30 TOPS", label: "AI Processing" },
                  { value: "6 Cams", label: "Vision Array" },
                  { value: "41 DOF", label: "Motion" },
                  { value: "28 Lang", label: "Languages" },
                  { value: "5 hrs", label: "Battery Life" },
                  { value: "99.9%", label: "Cloud SLA" },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex flex-col gap-1"
                  >
                    <span className="text-2xl font-bold text-[#0066FF]">
                      {metric.value}
                    </span>
                    <span className="text-xs text-white/30">{metric.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
