import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'
import path from 'path'

const BUCKET = 'media'
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.` },
        { status: 400 }
      )
    }

    const originalFilename = file.name
    const ext = path.extname(originalFilename).toLowerCase()
    const uid = randomUUID()
    const storagePath = `uploads/${uid}${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = await createAdminClient()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[admin/media/upload] storage upload error:', uploadError)
      return Response.json({ error: 'Failed to upload file.' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    const { data: mediaRecord, error: insertError } = await supabase
      .from('media')
      .insert({
        filename: `${uid}${ext}`,
        original_filename: originalFilename,
        url: publicUrl,
        storage_path: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text: formData.get('alt_text') ? String(formData.get('alt_text')).trim() : null,
        uploaded_by: auth.user.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[admin/media/upload] media insert error:', insertError)
      // File uploaded but DB record failed — return url anyway but log
      return Response.json({ url: publicUrl, id: null, warning: 'Media record not saved.' })
    }

    return Response.json({ url: publicUrl, id: mediaRecord.id }, { status: 201 })
  } catch (err) {
    console.error('[admin/media/upload] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
