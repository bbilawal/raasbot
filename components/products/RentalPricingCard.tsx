'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { CalendarDays, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type RentalPeriod = 'daily' | 'weekly' | 'monthly'

type RentalPricingCardProps = {
  productId: string
  productName: string
  dailyPrice: number | null
  weeklyPrice: number | null
  monthlyPrice: number | null
  depositAmount?: number | null
}

function diffDays(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  const diff = b.getTime() - a.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function diffWeeks(days: number): number {
  return Math.max(1, Math.ceil(days / 7))
}

function diffMonths(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  return Math.max(1, months)
}

export function RentalPricingCard({
  productId,
  productName,
  dailyPrice,
  weeklyPrice,
  monthlyPrice,
  depositAmount,
}: RentalPricingCardProps) {
  const t = useTranslations('products')
  const rt = useTranslations('rentals')
  const locale = useLocale()

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [period, setPeriod] = useState<RentalPeriod>('daily')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(tomorrow)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tabs: { key: RentalPeriod; label: string; price: number | null }[] = [
    { key: 'daily', label: t('rentalDaily'), price: dailyPrice },
    { key: 'weekly', label: t('rentalWeekly'), price: weeklyPrice },
    { key: 'monthly', label: t('rentalMonthly'), price: monthlyPrice },
  ].filter((tab): tab is { key: RentalPeriod; label: string; price: number | null } => tab.price !== null)

  const total = useMemo(() => {
    if (!startDate || !endDate) return 0
    if (new Date(endDate) <= new Date(startDate)) return 0

    switch (period) {
      case 'daily':
        return (dailyPrice ?? 0) * diffDays(startDate, endDate)
      case 'weekly':
        return (weeklyPrice ?? 0) * diffWeeks(diffDays(startDate, endDate))
      case 'monthly':
        return (monthlyPrice ?? 0) * diffMonths(startDate, endDate)
    }
  }, [period, startDate, endDate, dailyPrice, weeklyPrice, monthlyPrice])

  const units = useMemo(() => {
    if (!startDate || !endDate) return 0
    if (new Date(endDate) <= new Date(startDate)) return 0
    const days = diffDays(startDate, endDate)
    switch (period) {
      case 'daily': return days
      case 'weekly': return diffWeeks(days)
      case 'monthly': return diffMonths(startDate, endDate)
    }
  }, [period, startDate, endDate])

  const selectedPrice =
    period === 'daily' ? dailyPrice : period === 'weekly' ? weeklyPrice : monthlyPrice

  async function handleRentNow() {
    if (!startDate || !endDate || !total) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/shop/rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          period,
          startDate,
          endDate,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.sessionUrl) {
        throw new Error(data.error ?? 'Failed to create rental session')
      }

      window.location.href = data.sessionUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (tabs.length === 0) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays size={18} className="text-[#0066FF]" />
        <h3 className="font-semibold text-white">{t('rentalOptions')}</h3>
      </div>

      {/* Period tabs */}
      <div
        className="flex gap-1 bg-[#0A0A0A] rounded-xl p-1"
        role="tablist"
        aria-label={rt('selectPeriod')}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={period === tab.key}
            onClick={() => setPeriod(tab.key)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200',
              period === tab.key
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            )}
          >
            {tab.label}
            <span className="block text-xs font-normal mt-0.5 opacity-80">
              ${tab.price?.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium" htmlFor="rental-start">
            {rt('startDate')}
          </label>
          <input
            id="rental-start"
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/50 focus:ring-2 focus:ring-[#0066FF]/20 transition-colors [color-scheme:dark]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-white/50 font-medium" htmlFor="rental-end">
            {rt('endDate')}
          </label>
          <input
            id="rental-end"
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-white text-sm focus:outline-none focus:border-[#0066FF]/50 focus:ring-2 focus:ring-[#0066FF]/20 transition-colors [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Price breakdown */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-[#0A0A0A] border border-white/8 p-4 flex flex-col gap-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-white/50">
              {selectedPrice?.toLocaleString()} &times; {units}{' '}
              {period === 'daily' ? 'day(s)' : period === 'weekly' ? 'week(s)' : 'month(s)'}
            </span>
            <span className="text-white">${total.toLocaleString()}</span>
          </div>

          {depositAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-white/50">{t('rentalDeposit')}</span>
              <span className="text-white/70">${depositAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-semibold pt-2 border-t border-white/8">
            <span className="text-white">Total</span>
            <span className="text-[#0066FF]">${total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}

      {depositAmount && (
        <p className="text-xs text-white/40">{rt('depositNote')}</p>
      )}

      <p className="text-xs text-white/30">{rt('termsNote')}</p>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleRentNow}
        disabled={!total || loading || new Date(endDate) <= new Date(startDate)}
        className="flex items-center justify-center gap-2 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : null}
        {loading ? 'Processing...' : t('rentNow')}
      </button>
    </div>
  )
}
