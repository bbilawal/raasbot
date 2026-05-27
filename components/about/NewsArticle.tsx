"use client";

import { motion } from "framer-motion";
import { Calendar, Tag, User } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type ArticleProps = {
  article: {
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    published_at: string | null;
    category: string | null;
    author: string | null;
  };
};

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsArticle({ article }: ArticleProps) {
  return (
    <article className="bg-[#0A0A0A] pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover image */}
        {article.cover_image ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10 rounded-2xl overflow-hidden"
          >
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-80 object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10 rounded-2xl h-72 bg-[#111111] border border-white/8 flex items-center justify-center overflow-hidden relative"
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
              aria-hidden="true"
            />
          </motion.div>
        )}

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="flex flex-wrap gap-4 items-center mb-6"
        >
          {article.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#0066FF] text-xs font-semibold">
              <Tag size={10} />
              {article.category}
            </span>
          )}
          {article.published_at && (
            <span className="flex items-center gap-1.5 text-white/40 text-sm">
              <Calendar size={13} />
              {formatDate(article.published_at)}
            </span>
          )}
          {article.author && (
            <span className="flex items-center gap-1.5 text-white/40 text-sm">
              <User size={13} />
              {article.author}
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          {article.title}
        </motion.h1>

        {article.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="text-lg text-white/60 leading-relaxed mb-10 border-l-2 border-[#0066FF] pl-5"
          >
            {article.excerpt}
          </motion.p>
        )}

        {/* Content */}
        {article.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-li:text-white/60"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </div>
    </article>
  );
}
