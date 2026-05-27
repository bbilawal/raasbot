import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ProductCard, type Product } from '@/components/products/ProductCard'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })
  return { title: t('title') }
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)

  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error)
  }

  const allProducts: Product[] = (products ?? []) as Product[]

  // Extract unique categories
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  ) as string[]

  // Filter by category if provided
  const filtered = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts

  const t = await getTranslations({ locale, namespace: 'shop' })

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-widest">
            Raasbot
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3 tracking-tight">
            {t('title')}
          </h1>
        </div>

        {/* Filters */}
        <ShopFilters categories={categories} activeCategory={category} />

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-white/40 text-lg">No products found</p>
            {category && (
              <Link href="/shop" className="text-[#0066FF] hover:underline text-sm">
                Clear filter
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
