import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

type RentalPeriod = 'daily' | 'weekly' | 'monthly'

interface RentalRequest {
  productId: string
  period: RentalPeriod
  startDate: string
  endDate: string
}

function calculateRentalTotal(
  period: RentalPeriod,
  startDate: Date,
  endDate: Date,
  priceDaily: number,
  priceWeekly: number,
  priceMonthly: number,
  deposit: number
): { rentalAmount: number; depositAmount: number; totalAmount: number } {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffMs = endDate.getTime() - startDate.getTime()
  const diffDays = Math.max(1, Math.ceil(diffMs / msPerDay))

  let rentalAmount = 0

  if (period === 'daily') {
    rentalAmount = priceDaily * diffDays
  } else if (period === 'weekly') {
    const weeks = Math.max(1, Math.ceil(diffDays / 7))
    rentalAmount = priceWeekly * weeks
  } else if (period === 'monthly') {
    const months = Math.max(1, Math.ceil(diffDays / 30))
    rentalAmount = priceMonthly * months
  }

  const depositAmount = deposit ?? 0
  return {
    rentalAmount,
    depositAmount,
    totalAmount: rentalAmount + depositAmount,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, period, startDate, endDate } = body as RentalRequest

    if (!productId) {
      return Response.json({ error: 'productId is required.' }, { status: 400 })
    }
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return Response.json({ error: 'period must be daily, weekly, or monthly.' }, { status: 400 })
    }
    if (!startDate || !endDate) {
      return Response.json({ error: 'startDate and endDate are required.' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return Response.json({ error: 'Invalid date format.' }, { status: 400 })
    }
    if (end <= start) {
      return Response.json({ error: 'endDate must be after startDate.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select(
        'id, name, rental_available, rental_price_daily, rental_price_weekly, rental_price_monthly, rental_deposit, images'
      )
      .eq('id', productId)
      .eq('is_active', true)
      .single()

    if (fetchError || !product) {
      return Response.json({ error: 'Product not found.' }, { status: 404 })
    }
    if (!product.rental_available) {
      return Response.json({ error: 'This product is not available for rental.' }, { status: 400 })
    }

    const priceForPeriod =
      period === 'daily'
        ? Number(product.rental_price_daily)
        : period === 'weekly'
          ? Number(product.rental_price_weekly)
          : Number(product.rental_price_monthly)

    if (!priceForPeriod || priceForPeriod <= 0) {
      return Response.json(
        { error: `Rental price not configured for period: ${period}.` },
        { status: 400 }
      )
    }

    const { rentalAmount, depositAmount, totalAmount } = calculateRentalTotal(
      period,
      start,
      end,
      Number(product.rental_price_daily ?? 0),
      Number(product.rental_price_weekly ?? 0),
      Number(product.rental_price_monthly ?? 0),
      Number(product.rental_deposit ?? 0)
    )

    const images: string[] = Array.isArray(product.images) ? product.images : []
    const imageUrls = images
      .slice(0, 1)
      .filter((img): img is string => typeof img === 'string' && img.startsWith('http'))

    const host = request.headers.get('host') ?? 'localhost:3000'
    const protocol = host.startsWith('localhost') ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${protocol}://${host}`

    const lineItems: {
      price_data: {
        currency: string
        product_data: { name: string; description: string; images?: string[] }
        unit_amount: number
      }
      quantity: number
    }[] = [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Rental: ${product.name}`,
            description: `${period} rental from ${startDate} to ${endDate}`,
            ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
          },
          unit_amount: Math.round(rentalAmount * 100),
        },
        quantity: 1,
      },
    ]

    if (depositAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Rental Security Deposit',
            description: 'Refundable deposit returned upon safe return of the robot.',
          },
          unit_amount: Math.round(depositAmount * 100),
        },
        quantity: 1,
      })
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/rent`,
      metadata: {
        type: 'rental',
        productId: product.id,
        period,
        startDate,
        endDate,
        rentalAmount: String(rentalAmount),
        depositAmount: String(depositAmount),
        totalAmount: String(totalAmount),
      },
    })

    return Response.json({ sessionUrl: session.url })
  } catch (err) {
    console.error('[shop/rental] unexpected error:', err)
    return Response.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
