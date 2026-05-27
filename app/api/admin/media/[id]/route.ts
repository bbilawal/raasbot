import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params

  try {
    const supabase = await createAdminClient()

    const { data: media } = await supabase
      .from('media')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (media?.storage_path) {
      await supabase.storage.from('media').remove([media.storage_path])
    }

    const { error } = await supabase.from('media').delete().eq('id', id)
    if (error) return Response.json({ error: 'Failed to delete.' }, { status: 500 })

    return Response.json({ deleted: true })
  } catch (err) {
    console.error('[admin/media/delete]', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
