'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Copy, Check } from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  original_filename: string
  url: string
  mime_type: string
  size_bytes: number
  alt_text: string | null
  created_at: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/media')
      .then(r => r.json())
      .then(d => { setItems(d.media ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok && data.id) {
      // Refresh full list to get complete record
      const listRes = await fetch('/api/admin/media')
      const listData = await listRes.json()
      setItems(listData.media ?? [])
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this file?')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(m => m.id !== id))
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return <div className="text-white/40 text-sm">Loading media…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} files</p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] disabled:opacity-50 transition-colors"
          >
            <Upload size={16} />
            {uploading ? 'Uploading…' : 'Upload File'}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-white/40 text-sm">No media uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group">
              <div className="aspect-square bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                {item.mime_type.startsWith('image/') ? (
                  <img src={item.url} alt={item.alt_text ?? item.original_filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/20 text-xs text-center p-2">{item.mime_type}</div>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs text-white/70 truncate">{item.original_filename}</div>
                <div className="text-xs text-white/30 mt-0.5">{formatBytes(item.size_bytes)}</div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-white/5 text-white/50 hover:text-white text-xs transition-colors"
                  >
                    {copied === item.url ? <Check size={10} /> : <Copy size={10} />}
                    {copied === item.url ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
