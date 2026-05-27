'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

type ShopFiltersProps = {
  categories: string[]
  activeCategory?: string
}

export function ShopFilters({ categories, activeCategory }: ShopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setCategory = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (cat) {
        params.set('category', cat)
      } else {
        params.delete('category')
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  if (categories.length === 0) return null

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by category"
    >
      <button
        onClick={() => setCategory(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          !activeCategory
            ? 'bg-[#0066FF] text-white'
            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
        )}
        aria-pressed={!activeCategory}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            activeCategory === cat
              ? 'bg-[#0066FF] text-white'
              : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
          )}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
