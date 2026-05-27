import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'

export async function generateMetadata() {
  return { title: 'Payment Cancelled' }
}

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-orange-500/15 flex items-center justify-center mx-auto mb-6 ring-4 ring-orange-500/20">
          <XCircle size={40} className="text-orange-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Payment Cancelled</h1>
        <p className="text-white/50 mb-8">
          Your payment was cancelled. No charges were made. Your cart items are still
          saved — you can continue shopping whenever you&apos;re ready.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl transition-colors"
          >
            <ShoppingCart size={16} />
            Return to Shop
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-medium rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
