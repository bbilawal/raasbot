import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductGallery } from '@/components/products/ProductGallery'
import { SpecsTable } from '@/components/products/SpecsTable'
import { RentalPricingCard } from '@/components/products/RentalPricingCard'
import { ProductActions } from '@/components/products/ProductActions'
import { Link } from '@/i18n/navigation'
import { ProductCard, type Product } from '@/components/products/ProductCard'
import { ArrowLeft, Tag } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name_en, name_fr')
    .eq('slug', slug)
    .single()

  if (!data) return {}

  const name = locale === 'fr' ? data.name_fr : data.name_en
  return { title: name }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch related products (same category, excluding this one)
  const { data: relatedRaw } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .eq('in_stock', true)
    .neq('id', product.id)
    .limit(4)

  const related: Product[] = (relatedRaw ?? []) as Product[]

  const t = await getTranslations({ locale, namespace: 'products' })

  const name = locale === 'fr' ? product.name_fr : product.name_en
  const description =
    locale === 'fr'
      ? (product.description_fr ?? product.description_en ?? '')
      : (product.description_en ?? '')

  // Gallery: primary image + gallery_images array
  const galleryImages: string[] = []
  if (product.image_url) galleryImages.push(product.image_url)
  if (Array.isArray(product.gallery_images)) {
    galleryImages.push(...(product.gallery_images as string[]))
  }

  const specs: Record<string, string> =
    product.specs && typeof product.specs === 'object'
      ? (product.specs as Record<string, string>)
      : {}

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Shop
        </Link>
      </div>

      {/* Hero section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Gallery */}
          <div>
            <ProductGallery images={galleryImages} productName={name} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Category */}
            {product.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
                <Tag size={12} />
                {product.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {name}
            </h1>

            {description && (
              <p className="text-white/60 text-base leading-relaxed">{description}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.rental_available && product.rental_price_daily && (
                <span className="text-sm text-white/40">
                  {t('startingFrom')} ${product.rental_price_daily}/day
                </span>
              )}
            </div>

            {/* Stock badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${
                product.in_stock
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-red-500/15 text-red-400 border border-red-500/25'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-emerald-400' : 'bg-red-400'}`}
              />
              {product.in_stock ? t('inStock') : t('outOfStock')}
            </span>

            {/* Purchase / cart actions */}
            <ProductActions
              product={product as Product}
              locale={locale}
            />

            {/* Quote link */}
            <Link
              href="/about/contact"
              className="flex items-center justify-center gap-2 py-3.5 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-medium rounded-xl transition-colors"
            >
              {t('getQuote')}
            </Link>
          </div>
        </div>
      </section>

      {/* Rental section */}
      {product.rental_available && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">{t('rentalOptions')}</h2>
          <div className="max-w-lg">
            <RentalPricingCard
              productId={product.id}
              productName={name}
              dailyPrice={product.rental_price_daily}
              weeklyPrice={product.rental_price_weekly}
              monthlyPrice={product.rental_price_monthly}
              depositAmount={product.rental_deposit}
            />
          </div>
        </section>
      )}

      {/* Specs */}
      {Object.keys(specs).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">{t('specifications')}</h2>
          <SpecsTable specs={specs} className="max-w-2xl" />
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
