'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SheetSide = 'left' | 'right' | 'top' | 'bottom'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: SheetSide
}

const SLIDE = {
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
}

const SIDE_CLASSES: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 w-full max-w-md',
  left: 'inset-y-0 left-0 w-full max-w-md',
  top: 'inset-x-0 top-0 h-auto',
  bottom: 'inset-x-0 bottom-0 h-auto',
}

export function Sheet({ open, onOpenChange, children, side = 'right' }: SheetProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={SLIDE[side].initial}
            animate={SLIDE[side].animate}
            exit={SLIDE[side].exit}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'fixed z-50 flex flex-col bg-[#0A0A0A] border-l border-white/10 shadow-2xl',
              SIDE_CLASSES[side]
            )}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-white/10', className)}>
      {children}
    </div>
  )
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-lg font-semibold text-white', className)}>{children}</h2>
  )
}

export function SheetClose({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors',
        className
      )}
      aria-label="Close"
    >
      <X size={18} />
    </button>
  )
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function SheetFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/10', className)}>
      {children}
    </div>
  )
}
