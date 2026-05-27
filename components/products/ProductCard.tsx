'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, FileText, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'
import { useCart } from '@/lib/cart/CartContext'
import { cn } from '@/lib/utils'

type LocaleHref = ComponentProps<typeof Link>['href']

export type Product = {
  id: string
  slug: string
  name_en: string
  name_fr: string
  price: number
  image_url: string | null
  in_stock: boolean
  rental_available: boolean
  rental_price_daily: number | null
  rental_price_weekly: number | null
  rental_price_monthly: number | null
  category: string | null
}

type ProductCardProps = {
  product: Product
  locale: string
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTExMTExIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNDQ0NDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gaW1hZ2U8L3RleHQ+PC9zdmc+'

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('products')
  const { addItem, openCart } = useCart()

  const name = locale === 'fr' ? product.name_fr : product.name_en

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
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

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl border border-white/8 bg-[#111111] overflow-hidden hover:border-[#0066FF]/30 hover:shadow-xl hover:shadow-[#0066FF]/5 transition-colors duration-300"
      aria-label={name}
    >
      <Link href={{ pathname: '/shop/[slug]', params: { slug: product.slug } } as LocaleHref} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#161616] to-[#0F0F0F] overflow-hidden">
          <Image
            src={product.image_url ?? PLACEHOLDER_IMAGE}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE
            }}
          />

          {/* Stock badge */}
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
              product.in_stock
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            )}
          >
            {product.in_stock ? t('inStock') : t('outOfStock')}
          </span>

          {/* Category */}
          {product.category && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30">
              {product.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-semibold text-white group-hover:text-[#0066FF] transition-colors mb-1">
            {name}
          </h3>

          <div className="flex items-center gap-3 mt-auto pt-3">
            <div>
              <p className="text-lg font-bold text-white">
                ${product.price.toLocaleString()}
              </p>
              {product.rental_available && product.rental_price_daily && (
                <p className="text-xs text-white/50 mt-0.5">
                  {t('startingFrom')} ${product.rental_price_daily}/day
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex gap-2 px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-colors',
            product.in_stock
              ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          )}
          aria-label={`${t('addToCart')} - ${name}`}
        >
          <ShoppingCart size={13} />
          {t('addToCart')}
        </button>

        <Link
          href="/about/contact"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs font-semibold rounded-xl transition-colors"
          aria-label={`${t('getQuote')} - ${name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <FileText size={13} />
          <Tag size={13} className="hidden sm:block" />
        </Link>
      </div>
    </motion.article>
  )
}
