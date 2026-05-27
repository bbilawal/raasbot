import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: posts, error } = await supabase
      .from('news_posts')
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        tags,
        published_at,
        author_id,
        user_profiles (
          id,
          full_name,
          avatar_url
        )
        `
      )
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (error) {
      console.error('[public/news] fetch error:', error)
      return Response.json({ error: 'Failed to fetch news.' }, { status: 500 })
    }

    return Response.json({ posts: posts ?? [] })
  } catch (err) {
    console.error('[public/news] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
