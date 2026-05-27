import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !name.trim()) {
      return Response.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (!email || !email.trim()) {
      return Response.json({ error: 'Email is required.' }, { status: 400 })
    }
    if (!message || !message.trim()) {
      return Response.json({ error: 'Message is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : null,
      message: message.trim(),
    })

    if (error) {
      console.error('[contact] insert error:', error)
      return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
