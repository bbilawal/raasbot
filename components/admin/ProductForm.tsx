'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormData {
  id?: string
  name?: string
  slug?: string
  short_description?: string
  description?: string
  price?: number | null
  compare_at_price?: number | null
  rental_available?: boolean
  rental_price_daily?: number | null
  rental_price_weekly?: number | null
  rental_price_monthly?: number | null
  rental_deposit?: number | null
  stock_quantity?: number
  is_active?: boolean
  is_featured?: boolean
  category_id?: string | null
}

interface ProductFormProps {
  initialData?: ProductFormData
  mode: 'create' | 'edit'
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [shortDescription, setShortDescription] = useState(initialData?.short_description ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [price, setPrice] = useState(initialData?.price?.toString() ?? '')
  const [compareAtPrice, setCompareAtPrice] = useState(initialData?.compare_at_price?.toString() ?? '')
  const [stockQuantity, setStockQuantity] = useState(initialData?.stock_quantity?.toString() ?? '0')
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false)
  const [rentalAvailable, setRentalAvailable] = useState(initialData?.rental_available ?? false)
  const [rentalPriceDaily, setRentalPriceDaily] = useState(initialData?.rental_price_daily?.toString() ?? '')
  const [rentalPriceWeekly, setRentalPriceWeekly] = useState(initialData?.rental_price_weekly?.toString() ?? '')
  const [rentalPriceMonthly, setRentalPriceMonthly] = useState(initialData?.rental_price_monthly?.toString() ?? '')
  const [rentalDeposit, setRentalDeposit] = useState(initialData?.rental_deposit?.toString() ?? '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '')

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        // Extract unique categories from products
        const seen = new Set<string>()
        const cats: Category[] = []
        for (const p of d.products ?? []) {
          const cat = p.product_categories
          if (cat && !seen.has(cat.id)) {
            seen.add(cat.id)
            cats.push(cat)
          }
        }
        setCategories(cats)
      })
      .catch(() => {})
  }, [])

  function handleNameChange(value: string) {
    setName(value)
    if (mode === 'create') {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      price: price ? Number(price) : null,
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      stock_quantity: Number(stockQuantity) || 0,
      is_active: isActive,
      is_featured: isFeatured,
      rental_available: rentalAvailable,
      rental_price_daily: rentalAvailable && rentalPriceDaily ? Number(rentalPriceDaily) : null,
      rental_price_weekly: rentalAvailable && rentalPriceWeekly ? Number(rentalPriceWeekly) : null,
      rental_price_monthly: rentalAvailable && rentalPriceMonthly ? Number(rentalPriceMonthly) : null,
      rental_deposit: rentalAvailable && rentalDeposit ? Number(rentalDeposit) : null,
      category_id: categoryId || null,
    }

    try {
      const url =
        mode === 'edit' && initialData?.id
          ? `/api/admin/products/${initialData.id}`
          : '/api/admin/products'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Product Name *</label>
            <input
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="RaasBot X1"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Slug *</label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="raasbot-x1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Short Description</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            placeholder="Brief tagline for the product"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Full Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors resize-y"
            placeholder="Full product description…"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Pricing & Inventory</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Compare At ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Stock Quantity</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Settings</h2>

        <div className="flex flex-col gap-3">
          {[
            { label: 'Active (visible on site)', value: isActive, set: setIsActive },
            { label: 'Featured product', value: isFeatured, set: setIsFeatured },
            { label: 'Available for rental', value: rentalAvailable, set: setRentalAvailable },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={value}
                onClick={() => set(!value)}
                className={`relative inline-flex w-10 h-6 rounded-full transition-colors focus:outline-none ${
                  value ? 'bg-[#0066FF]' : 'bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-white/80">{label}</span>
            </label>
          ))}
        </div>

        {rentalAvailable && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Daily Price ($)', value: rentalPriceDaily, set: setRentalPriceDaily },
              { label: 'Weekly Price ($)', value: rentalPriceWeekly, set: setRentalPriceWeekly },
              { label: 'Monthly Price ($)', value: rentalPriceMonthly, set: setRentalPriceMonthly },
              { label: 'Deposit ($)', value: rentalDeposit, set: setRentalDeposit },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-sm text-white/60 mb-1.5">{label}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/60 focus:ring-1 focus:ring-[#0066FF]/30 transition-colors"
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
