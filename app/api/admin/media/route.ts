import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: media, error } = await supabase
      .from('media')
      .select('id, filename, original_filename, url, mime_type, size_bytes, alt_text, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/media] fetch error:', error)
      return Response.json({ error: 'Failed to fetch media.' }, { status: 500 })
    }

    return Response.json({ media: media ?? [] })
  } catch (err) {
    console.error('[admin/media] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
