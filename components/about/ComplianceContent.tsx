"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Download, CheckCircle2, Award } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const CERTIFICATIONS = [
  {
    name: "ISO 9001:2015",
    description: "Quality Management Systems — applies to all Raasbot manufacturing and engineering processes.",
    region: "International",
  },
  {
    name: "ISO 10218-1",
    description: "Safety Requirements for Industrial Robots — design and construction safety standards.",
    region: "International",
  },
  {
    name: "CE Marking",
    description: "European Conformity — all Raasbot products meet EU safety, health, and environmental requirements.",
    region: "European Union",
  },
  {
    name: "UL Listed",
    description: "Underwriters Laboratories certification for electrical safety applicable to North American markets.",
    region: "North America",
  },
  {
    name: "CSA Certified",
    description: "Canadian Standards Association certification ensuring compliance with Canadian safety standards.",
    region: "Canada",
  },
  {
    name: "FCC Part 15",
    description: "Federal Communications Commission compliance for electromagnetic emissions from our electronics.",
    region: "United States",
  },
  {
    name: "GDPR Compliant",
    description: "All data processing activities comply with the EU General Data Protection Regulation.",
    region: "European Union",
  },
  {
    name: "PIPEDA Compliant",
    description: "Personal Information Protection and Electronic Documents Act compliance for Canadian data privacy.",
    region: "Canada",
  },
];

const DOWNLOADABLE_DOCS = [
  {
    title: "Compliance Overview 2025",
    description: "Summary of all current certifications and regulatory status",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    title: "ISO 9001 Certificate",
    description: "Current quality management system certification",
    type: "PDF",
    size: "0.8 MB",
  },
  {
    title: "CE Declaration of Conformity",
    description: "EU Declaration of Conformity for Walker S2 and S1 series",
    type: "PDF",
    size: "1.1 MB",
  },
  {
    title: "Safety & Risk Assessment Report",
    description: "Third-party safety validation for humanoid product line",
    type: "PDF",
    size: "5.7 MB",
  },
  {
    title: "Privacy Impact Assessment",
    description: "GDPR and PIPEDA privacy impact assessment summary",
    type: "PDF",
    size: "3.2 MB",
  },
];

const REGULATORY_AREAS = [
  {
    icon: ShieldCheck,
    title: "Product Safety",
    description:
      "All Raasbot robots undergo comprehensive third-party safety testing before market release, including structural integrity, electrical safety, and collision avoidance validation.",
  },
  {
    icon: CheckCircle2,
    title: "Data Privacy",
    description:
      "We design privacy into our products from day one. All sensor data is processed on-device where possible, and any cloud data transmission is encrypted and governed by clear data retention policies.",
  },
  {
    icon: Award,
    title: "Environmental Standards",
    description:
      "Our products comply with RoHS (Restriction of Hazardous Substances) and WEEE (Waste Electrical and Electronic Equipment) directives, and we operate a certified take-back program.",
  },
];

export function ComplianceContent() {
  const certsRef = useRef<HTMLDivElement>(null);
  const certsInView = useInView(certsRef, { once: true, margin: "-60px" });

  const docsRef = useRef<HTMLDivElement>(null);
  const docsInView = useInView(docsRef, { once: true, margin: "-60px" });

  return (
    <>
      {/* Regulatory Areas */}
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
              Our Approach
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Compliance as a Core Value
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {REGULATORY_AREAS.map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="p-8 rounded-2xl border border-white/8 bg-[#111111]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center mb-6">
                    <Icon size={22} className="text-[#0066FF]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {area.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed text-sm">
                    {area.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
              Certifications
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Recognized Standards We Meet
            </h2>
          </motion.div>

          <div ref={certsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 24 }}
                animate={certsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="p-5 rounded-xl border border-white/8 bg-[#0A0A0A]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-[#0066FF]" />
                  <span className="text-xs text-white/30">{cert.region}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {cert.name}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Documents */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-12"
          >
            <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
              Documents
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Compliance Documentation
            </h2>
          </motion.div>

          <div ref={docsRef} className="flex flex-col gap-3 max-w-3xl">
            {DOWNLOADABLE_DOCS.map((doc, i) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, x: -20 }}
                animate={docsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="group flex items-center justify-between p-5 rounded-xl border border-white/8 bg-[#111111] hover:border-[#0066FF]/20 hover:bg-[#161616] transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-white/40">{doc.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <span className="block text-xs text-[#0066FF] font-semibold">
                      {doc.type}
                    </span>
                    <span className="block text-xs text-white/30">{doc.size}</span>
                  </div>
                  <button
                    className="w-9 h-9 rounded-lg bg-[#0066FF]/10 hover:bg-[#0066FF]/20 flex items-center justify-center transition-colors"
                    aria-label={`Download ${doc.title}`}
                  >
                    <Download size={15} className="text-[#0066FF]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
