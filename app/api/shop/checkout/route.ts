import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

interface CheckoutItem {
  productId: string
  quantity: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, locale } = body as { items: CheckoutItem[]; locale?: string }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'No items provided.' }, { status: 400 })
    }

    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return Response.json({ error: 'Invalid productId.' }, { status: 400 })
      }
      if (!item.quantity || item.quantity < 1) {
        return Response.json({ error: 'Quantity must be at least 1.' }, { status: 400 })
      }
    }

    const supabase = await createClient()
    const productIds = items.map((i) => i.productId)

    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, price, images, stripe_price_id')
      .in('id', productIds)
      .eq('is_active', true)

    if (fetchError) {
      console.error('[shop/checkout] fetch products error:', fetchError)
      return Response.json({ error: 'Failed to fetch products.' }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return Response.json({ error: 'No valid products found.' }, { status: 400 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    const lineItems = items
      .map((item) => {
        const product = productMap.get(item.productId)
        if (!product) return null

        const images: string[] = Array.isArray(product.images) ? product.images : []
        const imageUrls = images
          .slice(0, 1)
          .filter((img): img is string => typeof img === 'string' && img.startsWith('http'))

        return {
          price_data: {
            currency: 'cad',
            product_data: {
              name: product.name,
              ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
            },
            unit_amount: Math.round(Number(product.price) * 100),
          },
          quantity: item.quantity,
        }
      })
      .filter(Boolean) as NonNullable<ReturnType<typeof items.map>[number]>[]

    if (lineItems.length === 0) {
      return Response.json({ error: 'No valid line items.' }, { status: 400 })
    }

    const host = request.headers.get('host') ?? 'localhost:3000'
    const protocol = host.startsWith('localhost') ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`
    const localePath = locale ? `/${locale}` : ''

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}${localePath}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${localePath}/shop`,
      metadata: {
        type: 'purchase',
        itemCount: String(items.length),
        productIds: productIds.join(','),
      },
    })

    return Response.json({ sessionUrl: session.url })
  } catch (err) {
    console.error('[shop/checkout] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
