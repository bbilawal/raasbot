'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Code, ExternalLink, Search } from 'lucide-react'
import type { SupportDownload } from '@/app/[locale]/support/page'

const categories = ['All', 'Manual', 'Firmware', 'SDK', 'Driver', 'Brochure']

const PLACEHOLDER: SupportDownload[] = [
  { id: '1', title: 'Walker S2 User Manual', description: 'Complete user manual for Walker S2', file_url: '#', category: 'Manual', product: 'Walker S2', file_type: 'PDF', version: 'v2.1' },
  { id: '2', title: 'Raasbot SDK for Python', description: 'Python SDK for robot control', file_url: '#', category: 'SDK', product: 'All', file_type: 'ZIP', version: 'v3.0' },
  { id: '3', title: 'Walker C Firmware Update', description: 'Latest firmware for Walker C series', file_url: '#', category: 'Firmware', product: 'Walker C', file_type: 'BIN', version: 'v1.4.2' },
  { id: '4', title: 'Cruzr S2 Product Brochure', description: 'Full product specifications and features', file_url: '#', category: 'Brochure', product: 'Cruzr S2', file_type: 'PDF', version: null },
  { id: '5', title: 'USB Driver Package', description: 'Windows and macOS USB drivers', file_url: '#', category: 'Driver', product: 'All', file_type: 'ZIP', version: 'v2.0' },
  { id: '6', title: 'Panda Robot Manual', description: 'Setup and operation guide', file_url: '#', category: 'Manual', product: 'Panda', file_type: 'PDF', version: 'v1.0' },
]

export function SupportContent({ downloads }: { downloads: SupportDownload[] }) {
  const items = downloads.length > 0 ? downloads : PLACEHOLDER
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = items.filter(d => {
    const matchCat = category === 'All' || d.category === category
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search downloads..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0066FF]/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#0066FF]/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-[#0066FF]/10 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-[#0066FF]" />
              </div>
              {item.version && (
                <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-lg">{item.version}</span>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
            {item.description && <p className="text-xs text-white/50 mb-4">{item.description}</p>}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {item.product && <span className="text-xs text-white/40">{item.product}</span>}
                {item.file_type && <span className="text-xs text-[#0066FF]/70 font-mono">{item.file_type}</span>}
              </div>
              <a
                href={item.file_url ?? '#'}
                className="flex items-center gap-1.5 text-xs text-[#0066FF] hover:text-white transition-colors"
              >
                <Download size={14} />
                Download
              </a>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-white/40 col-span-3 text-center py-12">No downloads match your search.</p>
        )}
      </div>

      {/* Developer Portal */}
      <div className="border border-white/10 rounded-3xl p-8 bg-gradient-to-br from-[#0066FF]/5 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <Code size={24} className="text-[#0066FF]" />
          <h2 className="text-2xl font-bold text-white">Developer Portal</h2>
        </div>
        <p className="text-white/60 mb-6 max-w-xl">
          Access the Raasbot API documentation, SDKs, code samples, and developer tools to integrate our robots into your applications.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'API Reference', desc: 'Full REST API docs', href: '#' },
            { label: 'Python SDK', desc: 'Official Python client', href: '#' },
            { label: 'ROS Integration', desc: 'Robot Operating System', href: '#' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#0066FF]/30 hover:bg-[#0066FF]/5 transition-all group"
            >
              <div>
                <p className="text-sm font-medium text-white">{link.label}</p>
                <p className="text-xs text-white/50 mt-0.5">{link.desc}</p>
              </div>
              <ExternalLink size={14} className="text-white/30 group-hover:text-[#0066FF] transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
