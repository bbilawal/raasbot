'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  productInterest: z.string().min(2, 'Please specify your product of interest'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  deposit: z.boolean().default(false),
})

type QuoteFormValues = z.infer<typeof quoteSchema>

type QuoteFormProps = {
  prefillProduct?: string
  className?: string
}

export function QuoteForm({ prefillProduct, className }: QuoteFormProps) {
  const t = useTranslations('quote')
  const locale = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<QuoteFormValues>({
    defaultValues: {
      productInterest: prefillProduct ?? '',
      deposit: false,
    },
  })

  const depositChecked = watch('deposit')

  async function onSubmit(values: QuoteFormValues) {
    setServerError(null)

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          productInterest: values.productInterest,
          message: values.message,
          depositOptional: values.deposit,
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Submission failed')
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
        return
      }

      setSubmitted(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-8', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center">
          <FileText size={18} className="text-[#0066FF]" />
        </div>
        <h2 className="text-xl font-semibold text-white">{t('title')}</h2>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <p className="text-white font-medium">{t('success')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('name')} error={errors.name?.message}>
                <input
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  className={inputClass(!!errors.name)}
                />
              </Field>

              <Field label={t('email')} error={errors.email?.message}>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>
            </div>

            <Field label={t('company')} error={errors.company?.message}>
              <input
                {...register('company')}
                type="text"
                autoComplete="organization"
                placeholder="Acme Corp (optional)"
                className={inputClass(false)}
              />
            </Field>

            <Field label={t('productInterest')} error={errors.productInterest?.message}>
              <input
                {...register('productInterest', { required: 'Product interest is required' })}
                type="text"
                placeholder="Raasbot H1, EduBot Pro..."
                className={inputClass(!!errors.productInterest)}
              />
            </Field>

            <Field label={t('message')} error={errors.message?.message}>
              <textarea
                {...register('message', {
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' },
                })}
                rows={4}
                placeholder="Tell us about your requirements..."
                className={cn(inputClass(!!errors.message), 'resize-none')}
              />
            </Field>

            {/* Deposit checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  {...register('deposit')}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-md border border-white/20 bg-[#0A0A0A] peer-checked:bg-[#0066FF] peer-checked:border-[#0066FF] transition-colors flex items-center justify-center">
                  {depositChecked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                {t('deposit')}
              </span>
            </label>

            {serverError && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors mt-2"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSubmitting ? 'Submitting...' : t('submit')}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/70">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'px-4 py-3 rounded-xl bg-[#0A0A0A] border text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 transition-colors',
    hasError
      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
      : 'border-white/10 focus:border-[#0066FF]/50 focus:ring-[#0066FF]/20'
  )
}
