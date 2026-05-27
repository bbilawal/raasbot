import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: posts, error } = await supabase
      .from('news_posts')
      .select(
        `
        *,
        user_profiles (
          id,
          full_name,
          avatar_url
        )
        `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/news] fetch error:', error)
      return Response.json({ error: 'Failed to fetch news posts.' }, { status: 500 })
    }

    return Response.json({ posts: posts ?? [] })
  } catch (err) {
    console.error('[admin/news] unexpected error:', err)
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
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      tags,
      meta_title,
      meta_description,
      published_at,
    } = body

    if (!title || !title.trim()) {
      return Response.json({ error: 'Title is required.' }, { status: 400 })
    }
    if (!slug || !slug.trim()) {
      return Response.json({ error: 'Slug is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: post, error } = await supabase
      .from('news_posts')
      .insert({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        excerpt: excerpt ?? null,
        content: content ?? null,
        cover_image_url: cover_image_url ?? null,
        author_id: auth.user.id,
        tags: Array.isArray(tags) ? tags : [],
        meta_title: meta_title ?? null,
        meta_description: meta_description ?? null,
        published_at: published_at ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[admin/news] insert error:', error)
      if (error.code === '23505') {
        return Response.json({ error: 'A post with that slug already exists.' }, { status: 409 })
      }
      return Response.json({ error: 'Failed to create news post.' }, { status: 500 })
    }

    return Response.json({ post }, { status: 201 })
  } catch (err) {
    console.error('[admin/news] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
