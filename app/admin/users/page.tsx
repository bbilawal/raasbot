import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { UserRoleSelect } from './UserRoleSelect'

export default async function UsersPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, avatar_url, role, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load users: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-white/40 text-sm mt-1">{users?.length ?? 0} registered users</p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!users || users.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">User</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Role</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => {
                  const initials = (user.full_name || user.email || 'U')
                    .split(' ')
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] text-xs font-semibold flex-shrink-0 overflow-hidden">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || 'User'}
                                className="w-8 h-8 object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user.full_name || '—'}
                            </div>
                            <div className="text-white/40 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <UserRoleSelect userId={user.id} currentRole={user.role} />
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
