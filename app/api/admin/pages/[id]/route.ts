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
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !page) {
      return Response.json({ error: 'Page not found.' }, { status: 404 })
    }

    return Response.json({ page })
  } catch (err) {
    console.error('[admin/pages/[id]] GET error:', err)
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
      'slug',
      'content',
      'meta_title',
      'meta_description',
      'is_published',
      'published_at',
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (updateData.slug && typeof updateData.slug === 'string') {
      updateData.slug = updateData.slug.trim().toLowerCase()
    }

    // Auto-set published_at when publishing
    if (updateData.is_published === true && !('published_at' in updateData)) {
      updateData.published_at = new Date().toISOString()
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No valid fields to update.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: page, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/pages/[id]] PATCH error:', error)
      if (error.code === '23505') {
        return Response.json({ error: 'A page with that slug already exists.' }, { status: 409 })
      }
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Page not found.' }, { status: 404 })
      }
      return Response.json({ error: 'Failed to update page.' }, { status: 500 })
    }

    return Response.json({ page })
  } catch (err) {
    console.error('[admin/pages/[id]] PATCH error:', err)
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
    const { error } = await supabase.from('pages').delete().eq('id', id)

    if (error) {
      console.error('[admin/pages/[id]] DELETE error:', error)
      return Response.json({ error: 'Failed to delete page.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[admin/pages/[id]] DELETE error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
