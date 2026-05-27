import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdminOnly()
  if (!auth) {
    return Response.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()
    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('id, key, value, description, updated_at')
      .order('key', { ascending: true })

    if (error) {
      console.error('[admin/settings] fetch error:', error)
      return Response.json({ error: 'Failed to fetch settings.' }, { status: 500 })
    }

    // Return both as array and as a key-value map for convenience
    const settingsMap: Record<string, unknown> = {}
    for (const s of settings ?? []) {
      settingsMap[s.key] = s.value
    }

    return Response.json({ settings: settings ?? [], map: settingsMap })
  } catch (err) {
    console.error('[admin/settings] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminOnly()
  if (!auth) {
    return Response.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || typeof key !== 'string' || !key.trim()) {
      return Response.json({ error: 'key is required.' }, { status: 400 })
    }
    if (value === undefined) {
      return Response.json({ error: 'value is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Upsert: insert or update on conflict of key
    const { data: setting, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: key.trim(),
          value: value,
          updated_by: auth.user.id,
        },
        { onConflict: 'key' }
      )
      .select()
      .single()

    if (error) {
      console.error('[admin/settings] upsert error:', error)
      return Response.json({ error: 'Failed to update setting.' }, { status: 500 })
    }

    return Response.json({ setting })
  } catch (err) {
    console.error('[admin/settings] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
