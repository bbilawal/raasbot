import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { status, tracking_number } = body

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

    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number ? String(tracking_number).trim() : null
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/orders/[id]] PATCH error:', error)
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Order not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update order.' }, { status: 500 })
    }

    return Response.json({ order })
  } catch (err) {
    console.error('[admin/orders/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
