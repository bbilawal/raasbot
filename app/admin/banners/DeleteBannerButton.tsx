'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteBannerButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete banner "${title}"?`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete banner.')
      } else {
        router.refresh()
      }
    } catch {
      alert('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
      {loading ? '…' : 'Delete'}
    </button>
  )
}
