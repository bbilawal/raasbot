'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ShoppingCart, Zap, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import type { Product } from './ProductCard'
import { cn } from '@/lib/utils'

type ProductActionsProps = {
  product: Product
  locale: string
}

export function ProductActions({ product, locale }: ProductActionsProps) {
  const t = useTranslations('products')
  const { addItem, openCart } = useCart()
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const name = locale === 'fr' ? product.name_fr : product.name_en

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name,
      price: product.price,
      quantity: 1,
      image: product.image_url ?? '',
      slug: product.slug,
    })
    openCart()
  }

  async function handleBuyNow() {
    setBuyNowLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: product.id, quantity: 1 }],
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.sessionUrl) {
        throw new Error(data.error ?? 'Failed to create checkout')
      }

      window.location.href = data.sessionUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setBuyNowLoading(false)
    }
  }

  const disabled = !product.in_stock

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-4 font-semibold rounded-xl transition-colors text-sm',
            disabled
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          )}
          aria-label={t('addToCart')}
        >
          <ShoppingCart size={16} />
          {t('addToCart')}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={disabled || buyNowLoading}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-4 font-semibold rounded-xl transition-colors text-sm',
            disabled
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
          )}
          aria-label={t('buyNow')}
        >
          {buyNowLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Zap size={16} />
          )}
          {buyNowLoading ? 'Processing...' : t('buyNow')}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
