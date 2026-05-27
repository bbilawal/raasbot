"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const MILESTONES = [
  {
    year: "2015",
    title: "Founded",
    description:
      "13698491 Canada Inc is incorporated in Milton, Ontario. A team of five engineers begins building the first humanoid robot prototype in a garage workshop.",
    highlight: true,
  },
  {
    year: "2017",
    title: "First Robot Ships",
    description:
      "The Walker 1.0 becomes Raasbot's first commercially shipped robot. Initial deployments in three Canadian research universities validate our platform.",
    highlight: false,
  },
  {
    year: "2018",
    title: "Series A Funding",
    description:
      "Raasbot closes its Series A round, securing $24M CAD to expand manufacturing capacity and grow the engineering team to 120 members.",
    highlight: false,
  },
  {
    year: "2019",
    title: "International Expansion",
    description:
      "Raasbot opens offices in the United States, United Kingdom, and Germany. The Walker S1 launches in 15 countries, establishing our first global distribution network.",
    highlight: true,
  },
  {
    year: "2020",
    title: "Healthcare Initiative Launch",
    description:
      "Raasbot launches its first healthcare-focused robotic platform in response to pandemic-driven demand for contactless patient interaction and eldercare solutions.",
    highlight: false,
  },
  {
    year: "2021",
    title: "100 Patents Granted",
    description:
      "Raasbot surpasses 100 granted patents across AI vision, balance systems, and human-robot interaction — a testament to our R&D-first culture.",
    highlight: true,
  },
  {
    year: "2022",
    title: "Education Platform",
    description:
      "The Raasbot Education Suite launches for K-12 and higher education. Over 500 institutions adopt the platform in its first year, reaching 200,000 students.",
    highlight: false,
  },
  {
    year: "2023",
    title: "Healthcare Launch",
    description:
      "Full commercial launch of healthcare robotics suite across 20 long-term care facilities in Ontario. Partnership with major Canadian health networks signed.",
    highlight: true,
  },
  {
    year: "2024",
    title: "500+ Patents, 30+ Countries",
    description:
      "Patent portfolio grows to over 500 as we expand to 30+ countries. Logistics and consumer robotics divisions launch, rounding out our full product portfolio.",
    highlight: false,
  },
  {
    year: "2025",
    title: "Raasbot Platform Launch",
    description:
      "Raasbot.com launches as a unified commerce and information platform. The Walker S2, Alpha Mini 2, and full product lineup become available globally for purchase, rental, and enterprise deployment.",
    highlight: true,
  },
];

export function MilestonesTimeline() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="relative">
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#0066FF] via-[#0066FF]/30 to-transparent hidden sm:block"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-12">
            {MILESTONES.map((milestone, i) => (
              <MilestoneItem key={milestone.year} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: (typeof MILESTONES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative sm:pl-16"
    >
      {/* Year dot */}
      <div
        className={`hidden sm:flex absolute left-0 top-1 w-12 h-12 rounded-full items-center justify-center text-xs font-bold z-10 ${
          milestone.highlight
            ? "bg-[#0066FF] text-white border-2 border-[#0066FF]"
            : "bg-[#0A0A0A] text-[#0066FF] border border-[#0066FF]/40"
        }`}
      >
        {milestone.year}
      </div>

      <div
        className={`p-6 rounded-2xl border transition-all duration-300 ${
          milestone.highlight
            ? "border-[#0066FF]/30 bg-[#0066FF]/5"
            : "border-white/8 bg-[#111111]"
        }`}
      >
        {/* Mobile year */}
        <div className="sm:hidden mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              milestone.highlight
                ? "bg-[#0066FF] text-white"
                : "bg-[#111111] text-[#0066FF] border border-[#0066FF]/30"
            }`}
          >
            {milestone.year}
          </span>
        </div>

        <h3
          className={`text-lg font-bold mb-2 ${
            milestone.highlight ? "text-[#0066FF]" : "text-white"
          }`}
        >
          {milestone.title}
        </h3>
        <p className="text-white/55 leading-relaxed text-sm">
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}
