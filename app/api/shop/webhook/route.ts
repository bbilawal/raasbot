import { getStripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return Response.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET())
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return Response.json({ error: 'Webhook signature verification failed.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata ?? {}
    const type = metadata.type

    try {
      const supabase = await createAdminClient()

      if (type === 'purchase') {
        await handlePurchase(supabase, session, metadata)
      } else if (type === 'rental') {
        await handleRental(supabase, session, metadata)
      } else if (type === 'quote_deposit') {
        await handleQuoteDeposit(supabase, session, metadata)
      }
    } catch (err) {
      console.error(`[webhook] error handling ${type}:`, err)
      // Return 200 so Stripe doesn't retry — log and investigate separately
    }
  }

  return Response.json({ received: true })
}

async function handlePurchase(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const productIds = metadata.productIds ? metadata.productIds.split(',') : []

  // Build the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
      status: 'paid',
      total: (session.amount_total ?? 0) / 100,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      currency: session.currency ?? 'cad',
      metadata: metadata,
    })
    .select('id')
    .single()

  if (orderError) {
    console.error('[webhook/purchase] order insert error:', orderError)
    return
  }

  // Fetch products to build order items
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds)

    if (products && products.length > 0) {
      const orderItems = products.map(
        (p: { id: string; name: string; price: number }) => ({
          order_id: order.id,
          product_id: p.id,
          product_name: p.name,
          product_snapshot: { id: p.id, name: p.name, price: p.price },
          quantity: 1,
          unit_price: Number(p.price),
          total_price: Number(p.price),
        })
      )

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) {
        console.error('[webhook/purchase] order_items insert error:', itemsError)
      }
    }
  }
}

async function handleRental(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const { productId, period, startDate, endDate, rentalAmount, depositAmount, totalAmount } =
    metadata

  const { error } = await supabase.from('rentals').insert({
    product_id: productId,
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string' ? session.payment_intent : null,
    status: 'confirmed',
    period: period,
    start_date: startDate,
    end_date: endDate,
    deposit_amount: depositAmount ? Number(depositAmount) : 0,
    rental_amount: rentalAmount ? Number(rentalAmount) : 0,
    total_amount: totalAmount ? Number(totalAmount) : (session.amount_total ?? 0) / 100,
    currency: session.currency ?? 'cad',
    metadata: metadata,
  })

  if (error) {
    console.error('[webhook/rental] rental insert error:', error)
  }
}

async function handleQuoteDeposit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  session: Stripe.Checkout.Session,
  metadata: Record<string, string>
) {
  const { quoteId } = metadata

  if (!quoteId) {
    console.error('[webhook/quote_deposit] missing quoteId in metadata')
    return
  }

  const { error } = await supabase
    .from('quotes')
    .update({
      deposit_paid: true,
      deposit_session_id: session.id,
      deposit_amount: (session.amount_total ?? 0) / 100,
      status: 'contacted',
    })
    .eq('id', quoteId)

  if (error) {
    console.error('[webhook/quote_deposit] update error:', error)
  }
}
