import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const supabase = await createAdminClient()

    let query = supabase
      .from('rentals')
      .select(
        `
        *,
        products (
          id,
          name,
          slug,
          images
        )
        `
      )
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: rentals, error } = await query

    if (error) {
      console.error('[admin/rentals] fetch error:', error)
      return Response.json({ error: 'Failed to fetch rentals.' }, { status: 500 })
    }

    return Response.json({ rentals: rentals ?? [] })
  } catch (err) {
    console.error('[admin/rentals] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
