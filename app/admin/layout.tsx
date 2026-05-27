import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { LogOut } from 'lucide-react'

async function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </form>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#111111] border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-lg font-bold tracking-tight text-white">
            Raasbot <span className="text-[#0066FF]">Admin</span>
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <AdminSidebar />
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] text-sm font-semibold">
              {(profile.full_name || profile.email || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile.full_name || profile.email || 'Admin'}
              </p>
              <p className="text-xs text-white/40 capitalize">{profile.role}</p>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
