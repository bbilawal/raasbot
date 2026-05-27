'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface NewsFormData {
  id?: string
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  cover_image_url?: string
  tags?: string[]
  meta_title?: string
  meta_description?: string
  published_at?: string | null
}

interface NewsFormProps {
  initialData?: NewsFormData
  mode: 'create' | 'edit'
}

export function NewsForm({ initialData, mode }: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url ?? '')
  const [tagsRaw, setTagsRaw] = useState((initialData?.tags ?? []).join(', '))
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description ?? '')
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at
      ? new Date(initialData.published_at).toISOString().slice(0, 16)
      : ''
  )

  function handleTitleChange(value: string) {
    setTitle(value)
    if (mode === 'create') {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      tags,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    }

    try {
      const url =
        mode === 'edit' && initialData?.id
          ? `/api/admin/news/${initialData.id}`
          : '/api/admin/news'
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

      router.push('/admin/news')
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
        <h2 className="text-base font-semibold text-white">Article Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Title (EN) *</label>
            <input
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="Article title"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Slug *</label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="article-slug"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors resize-y"
            placeholder="Short summary of the article"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Content (Markdown / HTML)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors resize-y"
            placeholder="Full article content…"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Cover Image URL</label>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            type="url"
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Tags (comma-separated)</label>
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="robotics, AI, news"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Publish Date</label>
            <input
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              type="datetime-local"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
        </div>
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
          {loading ? 'Saving…' : mode === 'create' ? 'Create Article' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
