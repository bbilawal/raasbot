'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = ['admin', 'editor', 'customer']

interface UserRoleSelectProps {
  userId: string
  currentRole: string
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/30',
    editor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    customer: 'bg-white/5 text-white/50 border-white/10',
  }
  const cls = map[role] ?? 'bg-white/5 text-white/40 border-white/10'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${cls}`}>
      {role}
    </span>
  )
}

export { RoleBadge }

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)

  async function handleChange(newRole: string) {
    if (newRole === role) return
    setRole(newRole)
    setLoading(true)
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      router.refresh()
    } catch {
      // silent — role badge still shows optimistically
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <RoleBadge role={role} />
      <select
        value={role}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs focus:outline-none focus:border-[#0066FF]/60 transition-colors capitalize disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r} value={r} className="bg-[#111111] capitalize">
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}
