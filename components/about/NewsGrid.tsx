"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import type { NewsPost } from "@/app/[locale]/about/news/page";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const PLACEHOLDER_POSTS: NewsPost[] = [
  {
    id: "1",
    slug: "raasbot-launches-walker-s2-humanoid",
    title: "Raasbot Launches Walker S2 — Next-Generation Humanoid Robot",
    excerpt:
      "The Walker S2 sets a new benchmark for humanoid robotics with its advanced balance system, 41 degrees of freedom, and 5-hour battery life.",
    cover_image: null,
    published_at: "2025-10-15T00:00:00Z",
    category: "Product Launch",
  },
  {
    id: "2",
    slug: "raasbot-expands-to-european-market",
    title: "Raasbot Announces European Market Expansion",
    excerpt:
      "Following strong demand from healthcare and logistics sectors, Raasbot opens its European headquarters in Amsterdam.",
    cover_image: null,
    published_at: "2025-08-22T00:00:00Z",
    category: "Company News",
  },
  {
    id: "3",
    slug: "raasbot-100-patent-milestone",
    title: "Raasbot Surpasses 500 Granted Patents",
    excerpt:
      "A decade of relentless R&D has culminated in over 500 granted patents spanning AI vision, motion control, and human-robot interaction.",
    cover_image: null,
    published_at: "2025-06-10T00:00:00Z",
    category: "Milestone",
  },
  {
    id: "4",
    slug: "raasbot-healthcare-partnership",
    title: "Strategic Partnership with Leading Canadian Health Network",
    excerpt:
      "Raasbot signs a multi-year agreement to deploy elderly care robots across 20 long-term care facilities in Ontario.",
    cover_image: null,
    published_at: "2025-04-05T00:00:00Z",
    category: "Partnership",
  },
  {
    id: "5",
    slug: "raasbot-education-award",
    title: "Raasbot Education Platform Wins Global EdTech Award",
    excerpt:
      "Our AI-powered education suite has been recognized as the most innovative robotics curriculum platform for K-12 learners.",
    cover_image: null,
    published_at: "2025-02-18T00:00:00Z",
    category: "Award",
  },
  {
    id: "6",
    slug: "raasbot-logistics-launch",
    title: "Introducing the Raasbot Logistics Suite for Warehouse Automation",
    excerpt:
      "The new logistics product line reduces warehouse operational costs by up to 40% while increasing throughput.",
    cover_image: null,
    published_at: "2024-12-01T00:00:00Z",
    category: "Product Launch",
  },
];

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface NewsGridProps {
  posts: NewsPost[];
}

export function NewsGrid({ posts }: NewsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const displayPosts = posts.length > 0 ? posts : PLACEHOLDER_POSTS;

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 && (
          <div className="mb-10 px-4 py-3 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] text-sm">
            Showing sample news articles. Connect Supabase to display live
            content.
          </div>
        )}

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
            >
              <Link
                href={`/about/news/${post.slug}` as any}
                className="group flex flex-col h-full rounded-2xl border border-white/8 bg-[#111111] hover:border-[#0066FF]/20 hover:bg-[#161616] transition-all duration-300 overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                      }}
                    />
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#0066FF] text-xs font-semibold">
                        <Tag size={10} />
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 text-white/30 text-xs mb-3">
                      <Calendar size={12} />
                      {formatDate(post.published_at)}
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-white mb-3 leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-white/50 leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-1 text-[#0066FF] text-xs font-semibold">
                    Read more
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
