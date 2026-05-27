import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = await createAdminClient()
    const { data: banner, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !banner) {
      return Response.json({ error: 'Banner not found.' }, { status: 404 })
    }

    return Response.json({ banner })
  } catch (err) {
    console.error('[admin/banners/[id]] GET error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    const allowedFields = [
      'title',
      'subtitle',
      'image_url',
      'cta_text',
      'cta_url',
      'placement',
      'display_order',
      'is_active',
      'starts_at',
      'ends_at',
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: banner, error } = await supabase
      .from('banners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/banners/[id]] PATCH error:', error)
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Banner not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update banner.' }, { status: 500 })
    }

    return Response.json({ banner })
  } catch (err) {
    console.error('[admin/banners/[id]] PATCH error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { id } = await params

  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('banners').delete().eq('id', id)

    if (error) {
      console.error('[admin/banners/[id]] DELETE error:', error)
      return Response.json({ error: 'Failed to delete banner.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[admin/banners/[id]] DELETE error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
