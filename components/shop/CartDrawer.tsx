'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetContent,
  SheetFooter,
} from '@/components/ui/sheet'
import { useCart } from '@/lib/cart/CartContext'

export function CartDrawer() {
  const t = useTranslations('shop')
  const locale = useLocale()
  const { items, total, itemCount, removeItem, updateQuantity, isOpen, closeCart } =
    useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleCheckout() {
    if (items.length === 0) return
    setCheckoutLoading(true)
    setCheckoutError(null)

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.sessionUrl) {
        throw new Error(data.error ?? 'Checkout failed')
      }

      window.location.href = data.sessionUrl
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong')
      setCheckoutLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-[#0066FF]" />
          <SheetTitle>
            {t('cart')}
            {itemCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#0066FF] text-xs font-semibold">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </div>
        <SheetClose onClick={closeCart} />
      </SheetHeader>

      <SheetContent>
        {items.length === 0 ? (
          <EmptyCart message={t('emptyCart')} />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-3 p-3 rounded-xl border border-white/8 bg-[#111111]"
              >
                {/* Product image */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1A1A1A]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-sm text-white/50 mt-0.5">
                    ${item.price.toLocaleString()}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm text-white min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="ml-auto text-sm font-semibold text-white">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors self-start"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </SheetContent>

      {items.length > 0 && (
        <SheetFooter>
          {/* Subtotal */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm text-white/60">
              <span>{t('subtotal')}</span>
              <span className="text-white font-semibold">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-white/30">
              <span>{t('shipping')}</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-white/10 pt-3">
              <span className="text-white">{t('total')}</span>
              <span className="text-[#0066FF]">${total.toLocaleString()}</span>
            </div>

            {checkoutError && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {checkoutError}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {checkoutLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {checkoutLoading ? 'Processing...' : t('proceedToCheckout')}
            </button>

            <button
              onClick={closeCart}
              className="w-full py-3 text-sm text-white/50 hover:text-white transition-colors"
            >
              {t('continueShopping')}
            </button>
          </div>
        </SheetFooter>
      )}
    </Sheet>
  )
}

function EmptyCart({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
        <ShoppingBag size={28} className="text-white/20" />
      </div>
      <p className="text-white/40 text-sm">{message}</p>
    </div>
  )
}
