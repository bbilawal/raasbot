"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Award, Users, Cpu, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STATS = [
  { value: "500+", label: "Patents Filed", icon: Award },
  { value: "30+", label: "Countries Served", icon: Globe },
  { value: "10+", label: "Years of Innovation", icon: Cpu },
  { value: "1,200+", label: "Team Members", icon: Users },
];

const TEAM_HIGHLIGHTS = [
  {
    name: "Research & Development",
    description:
      "400+ engineers and researchers pushing the boundaries of AI, computer vision, and motion control.",
    count: "400+",
    countLabel: "Engineers",
  },
  {
    name: "Global Operations",
    description:
      "Offices and manufacturing facilities across North America, Europe, and Asia-Pacific.",
    count: "12",
    countLabel: "Global Offices",
  },
  {
    name: "Customer Success",
    description:
      "Dedicated support teams ensuring every deployment delivers measurable outcomes.",
    count: "98%",
    countLabel: "Client Satisfaction",
  },
];

export function CompanyProfileContent() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  const missionRef = useRef<HTMLDivElement>(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-60px" });

  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Stats */}
      <section
        ref={statsRef}
        className="bg-[#111111] border-y border-white/5 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#0066FF]" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/40">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={missionRef} className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
                Our Mission
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
                Democratizing Intelligent Robotics
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                At Raasbot, we believe that intelligent robotics should be
                accessible to every industry — from global enterprises to
                local communities. Our mission is to design, manufacture, and
                deploy robots that solve real-world problems with precision,
                reliability, and empathy.
              </p>
              <p className="text-white/60 leading-relaxed">
                Founded in Canada and operating globally, we combine deep
                engineering expertise with a human-centered approach to
                create solutions that augment human capability rather than
                replace it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
                Our Vision
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
                A World Where Robots Work Alongside Humanity
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                We envision a future where intelligent robots seamlessly
                integrate into every aspect of daily life — enhancing
                productivity, improving healthcare outcomes, advancing
                education, and making communities safer and more efficient.
              </p>
              <Link
                href="/solutions/humanoid"
                className="inline-flex items-center gap-2 text-[#0066FF] text-sm font-semibold hover:gap-3 transition-all"
              >
                Explore our solutions
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-24 bg-[#111111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Founding Story
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8">
              From a Small Lab to a Global Leader
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Raasbot began in 2015 with a simple question: why should
              advanced robotics be limited to well-funded research institutions?
              A small team of engineers in Milton, Ontario set out to change
              that, building their first prototype in a garage with off-the-shelf
              components and open-source software.
            </p>
            <p className="text-white/60 leading-relaxed">
              That first robot demonstrated that intelligent, affordable
              automation was possible. Today, operating as 13698491 Canada Inc
              from our headquarters at 1202 Stirling Todd Terrace, Milton,
              Ontario, we deliver robotics solutions to clients across 30+
              countries — staying true to our founding belief that technology
              should serve people.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Highlights */}
      <section ref={teamRef} className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Our Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The People Behind the Technology
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 28 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="p-8 rounded-2xl border border-white/8 bg-[#111111]"
              >
                <div className="text-4xl font-bold text-[#0066FF] mb-1">
                  {item.count}
                </div>
                <div className="text-sm text-white/40 mb-4">
                  {item.countLabel}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.name}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
