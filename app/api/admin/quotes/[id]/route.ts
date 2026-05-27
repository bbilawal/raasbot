import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['new', 'contacted', 'quoted', 'accepted', 'declined', 'closed']

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { status, notes } = body

    const updateData: Record<string, unknown> = {}

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return Response.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.` },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.notes = notes ? String(notes).trim() : null
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: quote, error } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/quotes/[id]] PATCH error:', error)
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Quote not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update quote.' }, { status: 500 })
    }

    return Response.json({ quote })
  } catch (err) {
    console.error('[admin/quotes/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
