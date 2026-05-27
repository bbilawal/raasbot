import type { NextRequest } from 'next/server'
import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_ROLES = ['admin', 'editor', 'customer']

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminOnly()
  if (!auth) {
    return Response.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { role } = body

    if (!role) {
      return Response.json({ error: 'role is required.' }, { status: 400 })
    }

    if (!VALID_ROLES.includes(role)) {
      return Response.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}.` },
        { status: 400 }
      )
    }

    // Prevent admin from removing their own admin role
    if (id === auth.user.id && role !== 'admin') {
      return Response.json(
        { error: 'You cannot change your own admin role.' },
        { status: 403 }
      )
    }

    const supabase = await createAdminClient()
    const { data: user, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, role, updated_at')
      .single()

    if (error) {
      console.error('[admin/users/[id]] PATCH error:', error)
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'User not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update user.' }, { status: 500 })
    }

    return Response.json({ user })
  } catch (err) {
    console.error('[admin/users/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
