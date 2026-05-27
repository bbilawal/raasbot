'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BannerFormData {
  id?: string
  title?: string
  subtitle?: string
  image_url?: string
  cta_text?: string
  cta_url?: string
  placement?: string
  display_order?: number
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

interface BannerFormProps {
  initialData?: BannerFormData
  mode: 'create' | 'edit'
}

const PLACEMENTS = ['homepage', 'shop', 'products', 'rentals', 'about', 'contact']

export function BannerForm({ initialData, mode }: BannerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '')
  const [ctaText, setCtaText] = useState(initialData?.cta_text ?? '')
  const [ctaUrl, setCtaUrl] = useState(initialData?.cta_url ?? '')
  const [placement, setPlacement] = useState(initialData?.placement ?? 'homepage')
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order?.toString() ?? '0')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [startsAt, setStartsAt] = useState(
    initialData?.starts_at
      ? new Date(initialData.starts_at).toISOString().slice(0, 16)
      : ''
  )
  const [endsAt, setEndsAt] = useState(
    initialData?.ends_at
      ? new Date(initialData.ends_at).toISOString().slice(0, 16)
      : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      image_url: imageUrl.trim() || null,
      cta_text: ctaText.trim() || null,
      cta_url: ctaUrl.trim() || null,
      placement,
      display_order: Number(displayOrder) || 0,
      is_active: isActive,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    }

    try {
      const url =
        mode === 'edit' && initialData?.id
          ? `/api/admin/banners/${initialData.id}`
          : '/api/admin/banners'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      router.push('/admin/banners')
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Banner Details</h2>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            placeholder="Banner title"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Subtitle</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            placeholder="Optional subtitle or description"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            type="url"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">CTA Text</label>
            <input
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="Shop Now"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">CTA Link</label>
            <input
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="/shop"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Placement</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors capitalize"
            >
              {PLACEMENTS.map((p) => (
                <option key={p} value={p} className="bg-[#111111] capitalize">
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Display Order</label>
            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Starts At</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Ends At</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex w-10 h-6 rounded-full transition-colors focus:outline-none ${
              isActive ? 'bg-[#0066FF]' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                isActive ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-white/80">Active</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : mode === 'create' ? 'Create Banner' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/banners')}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
