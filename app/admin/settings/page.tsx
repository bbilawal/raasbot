'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

interface Setting {
  id: string
  key: string
  value: { text?: string; [k: string]: unknown }
  description: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        const s: Setting[] = d.settings ?? []
        setSettings(s)
        const initial: Record<string, string> = {}
        s.forEach(setting => {
          initial[setting.key] = setting.value?.text ?? JSON.stringify(setting.value)
        })
        setEdits(initial)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save(key: string) {
    setSaving(key)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: { text: edits[key] } }),
    })
    setSaving(null)
  }

  if (loading) return <div className="text-white/40 text-sm">Loading settings…</div>

  const COMMON_KEYS = [
    { key: 'site_name', label: 'Site Name', placeholder: 'Raasbot' },
    { key: 'site_tagline', label: 'Site Tagline', placeholder: 'AI Robotics for Every Industry' },
    { key: 'contact_email', label: 'Contact Email', placeholder: 'info@raasbot.ca' },
    { key: 'phone', label: 'Phone', placeholder: '+1 (800) RAASBOT' },
    { key: 'address', label: 'Address', placeholder: '1202 Stirling Todd Terrace, Milton, Ontario' },
    { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/raasbot' },
    { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/raasbot' },
    { key: 'twitter_url', label: 'Twitter / X URL', placeholder: 'https://twitter.com/raasbot' },
    { key: 'youtube_url', label: 'YouTube URL', placeholder: '' },
  ]

  const existingKeys = new Set(settings.map(s => s.key))
  const allKeys = [
    ...COMMON_KEYS,
    ...settings
      .filter(s => !COMMON_KEYS.find(c => c.key === s.key))
      .map(s => ({ key: s.key, label: s.key, placeholder: '' })),
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage global site configuration</p>
      </div>

      <div className="space-y-4">
        {allKeys.map(({ key, label, placeholder }) => (
          <div key={key} className="bg-[#111111] border border-white/10 rounded-xl p-5">
            <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={edits[key] ?? ''}
                onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0066FF]/60 transition-colors"
              />
              <button
                onClick={() => save(key)}
                disabled={saving === key}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0066FF]/10 hover:bg-[#0066FF]/20 text-[#0066FF] text-sm font-medium disabled:opacity-50 transition-colors"
              >
                <Save size={14} />
                {saving === key ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
