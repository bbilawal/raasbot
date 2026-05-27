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
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: quotes, error } = await query

    if (error) {
      console.error('[admin/quotes] fetch error:', error)
      return Response.json({ error: 'Failed to fetch quotes.' }, { status: 500 })
    }

    return Response.json({ quotes: quotes ?? [] })
  } catch (err) {
    console.error('[admin/quotes] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
