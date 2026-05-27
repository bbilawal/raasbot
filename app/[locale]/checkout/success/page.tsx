import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getStripe } from '@/lib/stripe'
import { Link } from '@/i18n/navigation'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  return { title: t('orderConfirmed') }
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'shop' })

  type OrderDetails = {
    id: string
    customerEmail: string | null
    amount: number
    currency: string
    type: string
    items: Array<{ description: string | null; amount: number; quantity: number }>
  }

  let order: OrderDetails | null = null

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      })

      order = {
        id: session.id,
        customerEmail: session.customer_details?.email ?? null,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency?.toUpperCase() ?? 'USD',
        type: (session.metadata?.type as string) ?? 'purchase',
        items:
          session.line_items?.data.map((item) => ({
            description: item.description,
            amount: (item.amount_total ?? 0) / 100,
            quantity: item.quantity ?? 1,
          })) ?? [],
      }
    } catch (err) {
      console.error('Failed to fetch Stripe session:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 pt-16">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6 ring-4 ring-emerald-500/20">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{t('orderConfirmed')}</h1>
          <p className="text-white/50">{t('orderConfirmedDesc')}</p>
        </div>

        {/* Order details */}
        {order && (
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag size={18} className="text-[#0066FF]" />
              <h2 className="font-semibold text-white">{t('orderSummary')}</h2>
            </div>

            {/* Order ID */}
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/50">Order ID</span>
              <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded">
                {order.id.slice(-12).toUpperCase()}
              </span>
            </div>

            {order.customerEmail && (
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/50">Email</span>
                <span className="text-white">{order.customerEmail}</span>
              </div>
            )}

            {order.type === 'rental' && (
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/50">Type</span>
                <span className="text-[#0066FF] font-medium">Rental</span>
              </div>
            )}

            {/* Line items */}
            {order.items.length > 0 && (
              <div className="border-t border-white/8 pt-4 mt-4 flex flex-col gap-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-white/70 flex-1 pr-4">{item.description}</span>
                    <span className="text-white">
                      ${item.amount.toLocaleString()} &times; {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-base font-bold border-t border-white/8 pt-4 mt-4">
              <span className="text-white">{t('total')}</span>
              <span className="text-[#0066FF]">
                {order.currency} ${order.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl transition-colors"
          >
            {t('continueShopping')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center py-3.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-medium rounded-xl transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
