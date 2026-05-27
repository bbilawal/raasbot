'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageEditFormProps {
  pageId: string
  initialTitle: string
  initialSlug: string
  initialContent: string
  initialMetaTitle: string
  initialMetaDescription: string
  initialIsPublished: boolean
}

export function PageEditForm({
  pageId,
  initialTitle,
  initialSlug,
  initialContent,
  initialMetaTitle,
  initialMetaDescription,
  initialIsPublished,
}: PageEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [content, setContent] = useState(initialContent)
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle)
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription)
  const [isPublished, setIsPublished] = useState(initialIsPublished)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim() || null,
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save page.')
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          Page saved successfully.
        </div>
      )}

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Page Content</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Content (Markdown / HTML)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors resize-y"
            placeholder="Page content…"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={isPublished}
            onClick={() => setIsPublished(!isPublished)}
            className={`relative inline-flex w-10 h-6 rounded-full transition-colors focus:outline-none ${
              isPublished ? 'bg-[#0066FF]' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                isPublished ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-white/80">Published</span>
        </label>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">SEO</h2>
        <div>
          <label className="block text-sm text-white/60 mb-1.5">Meta Title</label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1.5">Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/pages')}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
