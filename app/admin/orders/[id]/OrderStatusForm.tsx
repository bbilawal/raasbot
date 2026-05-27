'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

interface OrderStatusFormProps {
  orderId: string
  currentStatus: string
  currentTracking: string | null
}

export function OrderStatusForm({ orderId, currentStatus, currentTracking }: OrderStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [tracking, setTracking] = useState(currentTracking ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking_number: tracking || null }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to update order.')
        return
      }

      setSuccess(true)
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          Order updated successfully.
        </div>
      )}

      <div>
        <label className="block text-sm text-white/60 mb-1.5">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-[#111111] capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1.5">Tracking Number</label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Optional tracking number"
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Saving…' : 'Update Order'}
      </button>
    </form>
  )
}
