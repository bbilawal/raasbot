import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdminOnly()
  if (!auth) {
    return Response.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/users] fetch error:', error)
      return Response.json({ error: 'Failed to fetch users.' }, { status: 500 })
    }

    return Response.json({ users: users ?? [] })
  } catch (err) {
    console.error('[admin/users] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
