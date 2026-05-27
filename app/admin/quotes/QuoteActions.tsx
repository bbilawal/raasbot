'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'accepted', 'declined', 'closed']

interface QuoteActionsProps {
  quoteId: string
  currentStatus: string
  quote: {
    name: string
    email: string
    company?: string
    phone?: string
    message?: string
    product_interest?: string
    created_at: string
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    quoted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    accepted: 'bg-green-500/10 text-green-400 border-green-500/20',
    declined: 'bg-red-500/10 text-red-400 border-red-500/20',
    closed: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  const cls = map[status] ?? 'bg-white/5 text-white/40 border-white/10'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${cls}`}>
      {status}
    </span>
  )
}

export function QuoteViewDialog({ quote }: { quote: QuoteActionsProps['quote'] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors"
      >
        View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quote Details</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-32 flex-shrink-0 text-white/40">Name</dt>
                <dd className="text-white">{quote.name}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-32 flex-shrink-0 text-white/40">Email</dt>
                <dd className="text-white">{quote.email}</dd>
              </div>
              {quote.company && (
                <div className="flex gap-3">
                  <dt className="w-32 flex-shrink-0 text-white/40">Company</dt>
                  <dd className="text-white">{quote.company}</dd>
                </div>
              )}
              {quote.phone && (
                <div className="flex gap-3">
                  <dt className="w-32 flex-shrink-0 text-white/40">Phone</dt>
                  <dd className="text-white">{quote.phone}</dd>
                </div>
              )}
              {quote.product_interest && (
                <div className="flex gap-3">
                  <dt className="w-32 flex-shrink-0 text-white/40">Interest</dt>
                  <dd className="text-white">{quote.product_interest}</dd>
                </div>
              )}
              {quote.message && (
                <div className="flex gap-3">
                  <dt className="w-32 flex-shrink-0 text-white/40">Message</dt>
                  <dd className="text-white whitespace-pre-wrap">{quote.message}</dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="w-32 flex-shrink-0 text-white/40">Submitted</dt>
                <dd className="text-white">{new Date(quote.created_at).toLocaleString()}</dd>
              </div>
            </dl>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function QuoteStatusSelect({
  quoteId,
  currentStatus,
}: {
  quoteId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    setStatus(newStatus)
    setLoading(true)
    try {
      await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs focus:outline-none focus:border-[#0066FF]/60 transition-colors capitalize disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-[#111111] capitalize">
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
