import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: pages, error } = await supabase
      .from('pages')
      .select('id, title, slug, is_published, published_at, meta_title, meta_description, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/pages] fetch error:', error)
      return Response.json({ error: 'Failed to fetch pages.' }, { status: 500 })
    }

    return Response.json({ pages: pages ?? [] })
  } catch (err) {
    console.error('[admin/pages] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, content, meta_title, meta_description, is_published, published_at } = body

    if (!title || !title.trim()) {
      return Response.json({ error: 'Page title is required.' }, { status: 400 })
    }
    if (!slug || !slug.trim()) {
      return Response.json({ error: 'Page slug is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        content: content ?? {},
        meta_title: meta_title ?? null,
        meta_description: meta_description ?? null,
        is_published: is_published ?? false,
        published_at: published_at ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[admin/pages] insert error:', error)
      if (error.code === '23505') {
        return Response.json({ error: 'A page with that slug already exists.' }, { status: 409 })
      }
      return Response.json({ error: 'Failed to create page.' }, { status: 500 })
    }

    return Response.json({ page }, { status: 201 })
  } catch (err) {
    console.error('[admin/pages] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
