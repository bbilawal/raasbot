'use client'

import { motion } from 'framer-motion'

type Section = { heading: string; body?: string; content?: string }

export function LegalContent({ sections, lastUpdated }: { sections: Section[]; lastUpdated?: string }) {
  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      <div className="space-y-10">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <h2 className="text-lg font-semibold text-white mb-3">{s.heading}</h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-line">{s.body ?? s.content}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-16 text-xs text-white/30">
        13698491 Canada Inc · 1202 Stirling Todd Terrace, Milton, Ontario, Canada
      </p>
    </section>
  )
}
