"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  FileText,
  Building2,
  Download,
  Calendar,
} from "lucide-react";
import type { InvestorDoc } from "@/app/[locale]/investor-relations/page";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const KEY_METRICS = [
  { value: "30+", label: "Countries of Operation", icon: TrendingUp },
  { value: "500+", label: "Patents Filed", icon: FileText },
  { value: "$24M+", label: "Venture Funding", icon: TrendingUp },
  { value: "1,200+", label: "Team Members", icon: Building2 },
];

const HIGHLIGHTS = [
  {
    year: "2025",
    title: "Platform Launch & Global Expansion",
    description:
      "Raasbot.com launches with full e-commerce capability. Enterprise contracts signed in healthcare and logistics verticals across North America and Europe.",
  },
  {
    year: "2024",
    title: "Portfolio Expansion",
    description:
      "Logistics and consumer product lines launched. Total addressable market expands significantly with new verticals. International distribution network established in 30+ countries.",
  },
  {
    year: "2023",
    title: "Healthcare Revenue Growth",
    description:
      "Healthcare robotics division reaches profitability. Multi-year contracts with Canadian health networks provide recurring revenue visibility.",
  },
  {
    year: "2021",
    title: "IP Portfolio Milestone",
    description:
      "Patent portfolio surpasses 100 granted patents, strengthening competitive moat and licensing potential across key technology areas.",
  },
];

const GOVERNANCE = [
  {
    role: "Independent Board Directors",
    description: "Majority-independent board with expertise in technology, healthcare, and finance",
  },
  {
    role: "Audit Committee",
    description: "Quarterly financial reviews with independent external auditors",
  },
  {
    role: "Compensation Committee",
    description: "Performance-linked executive compensation tied to revenue and R&D milestones",
  },
  {
    role: "Risk Committee",
    description: "Ongoing monitoring of operational, regulatory, and cybersecurity risk",
  },
];

const PLACEHOLDER_DOCS: InvestorDoc[] = [
  {
    id: "1",
    title: "Annual Report 2024",
    description: "Full annual report including financial statements and management discussion",
    file_url: null,
    doc_type: "Annual Report",
    published_at: "2025-04-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Q4 2024 Investor Update",
    description: "Quarterly business update for Q4 2024 including KPIs and outlook",
    file_url: null,
    doc_type: "Quarterly Update",
    published_at: "2025-02-15T00:00:00Z",
  },
  {
    id: "3",
    title: "Corporate Governance Charter",
    description: "Board structure, committee mandates, and governance policies",
    file_url: null,
    doc_type: "Governance",
    published_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "4",
    title: "Investor Presentation 2025",
    description: "Company overview, market opportunity, and growth strategy deck",
    file_url: null,
    doc_type: "Presentation",
    published_at: "2025-01-10T00:00:00Z",
  },
];

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface IRContentProps {
  docs: InvestorDoc[];
}

export function IRContent({ docs }: IRContentProps) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-60px" });

  const docsRef = useRef<HTMLDivElement>(null);
  const docsInView = useInView(docsRef, { once: true, margin: "-60px" });

  const displayDocs = docs.length > 0 ? docs : PLACEHOLDER_DOCS;
  const isPlaceholder = docs.length === 0;

  return (
    <>
      {/* Key Metrics */}
      <section
        ref={metricsRef}
        className="bg-[#111111] border-y border-white/5 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {KEY_METRICS.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={metricsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#0066FF]" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {metric.value}
                  </span>
                  <span className="text-sm text-white/40">{metric.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financial Highlights */}
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
              Financial Highlights
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Business Milestones by Year
            </h2>
          </motion.div>

          <div className="flex flex-col gap-5 max-w-3xl">
            {HIGHLIGHTS.map((highlight, i) => (
              <motion.div
                key={highlight.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="flex gap-6 p-6 rounded-2xl border border-white/8 bg-[#111111]"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#0066FF]">
                    {highlight.year}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
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
              Governance
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Accountable, Transparent Leadership
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {GOVERNANCE.map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="p-6 rounded-xl border border-white/8 bg-[#0A0A0A]"
              >
                <h3 className="text-sm font-bold text-white mb-2">
                  {item.role}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
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
              Documents
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Investor Document Library
            </h2>
          </motion.div>

          {isPlaceholder && (
            <div className="mb-8 px-4 py-3 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] text-sm">
              Showing sample documents. Connect Supabase investor_docs table to display live documents.
            </div>
          )}

          <div ref={docsRef} className="flex flex-col gap-3 max-w-3xl">
            {displayDocs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={docsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="group flex items-center justify-between p-5 rounded-xl border border-white/8 bg-[#111111] hover:border-[#0066FF]/20 hover:bg-[#161616] transition-all duration-300"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-[#0066FF]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {doc.doc_type && (
                        <span className="text-xs text-[#0066FF]">
                          {doc.doc_type}
                        </span>
                      )}
                      {doc.published_at && (
                        <span className="flex items-center gap-1 text-xs text-white/30">
                          <Calendar size={10} />
                          {formatDate(doc.published_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {doc.file_url ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#0066FF]/10 hover:bg-[#0066FF]/20 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
                    aria-label={`Download ${doc.title}`}
                  >
                    <Download size={15} className="text-[#0066FF]" />
                  </a>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ml-4">
                    <Download size={15} className="text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-12 p-6 rounded-2xl border border-white/8 bg-[#111111] max-w-3xl"
          >
            <h3 className="text-sm font-bold text-white mb-2">
              Investor Inquiries
            </h3>
            <p className="text-sm text-white/50 mb-4">
              For investor relations inquiries, please contact our IR team at{" "}
              <a
                href="mailto:ir@raasbot.com"
                className="text-[#0066FF] hover:underline"
              >
                ir@raasbot.com
              </a>{" "}
              or write to 13698491 Canada Inc, 1202 Stirling Todd Terrace, Milton, Ontario, Canada.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
