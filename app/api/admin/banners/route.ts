import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/banners] fetch error:', error)
      return Response.json({ error: 'Failed to fetch banners.' }, { status: 500 })
    }

    return Response.json({ banners: banners ?? [] })
  } catch (err) {
    console.error('[admin/banners] unexpected error:', err)
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
    const { title, subtitle, image_url, cta_text, cta_url, placement, display_order, is_active, starts_at, ends_at } = body

    if (!title || !title.trim()) {
      return Response.json({ error: 'Banner title is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: banner, error } = await supabase
      .from('banners')
      .insert({
        title: title.trim(),
        subtitle: subtitle ?? null,
        image_url: image_url ?? null,
        cta_text: cta_text ?? null,
        cta_url: cta_url ?? null,
        placement: placement ?? 'homepage',
        display_order: display_order != null ? Number(display_order) : 0,
        is_active: is_active ?? true,
        starts_at: starts_at ?? null,
        ends_at: ends_at ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('[admin/banners] insert error:', error)
      return Response.json({ error: 'Failed to create banner.' }, { status: 500 })
    }

    return Response.json({ banner }, { status: 201 })
  } catch (err) {
    console.error('[admin/banners] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
