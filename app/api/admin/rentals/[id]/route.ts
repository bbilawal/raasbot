import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['pending', 'confirmed', 'active', 'returned', 'overdue', 'cancelled']

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return Response.json({ error: 'status is required.' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(status)) {
      return Response.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.` },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()
    const { data: rental, error } = await supabase
      .from('rentals')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/rentals/[id]] PATCH error:', error)
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Rental not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update rental.' }, { status: 500 })
    }

    return Response.json({ rental })
  } catch (err) {
    console.error('[admin/rentals/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
