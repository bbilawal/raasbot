import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

// $99 CAD deposit (in cents)
const DEPOSIT_AMOUNT_CENTS = 9900

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, productInterest, message, depositOptional } = body

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

    const { data: quote, error: insertError } = await supabase
      .from('quotes')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company ? company.trim() : null,
        product_interest: productInterest ? productInterest.trim() : null,
        message: message.trim(),
        status: 'new',
        deposit_paid: false,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[quote] insert error:', insertError)
      return Response.json({ error: 'Failed to submit quote request.' }, { status: 500 })
    }

    if (depositOptional) {
      const host = request.headers.get('host') ?? 'localhost:3000'
      const protocol = host.startsWith('localhost') ? 'http' : 'https'
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`

      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'Priority Quote Deposit',
                description: `Refundable priority deposit for quote from ${name.trim()} (${email.trim()})`,
              },
              unit_amount: DEPOSIT_AMOUNT_CENTS,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: email.trim().toLowerCase(),
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/about/contact`,
        metadata: {
          type: 'quote_deposit',
          quoteId: quote.id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        },
      })

      // Store session reference on the quote
      await supabase
        .from('quotes')
        .update({ deposit_session_id: session.id, deposit_amount: DEPOSIT_AMOUNT_CENTS / 100 })
        .eq('id', quote.id)

      return Response.json({ sessionUrl: session.url })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[quote] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
