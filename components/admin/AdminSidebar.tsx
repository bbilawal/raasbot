'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Repeat,
  FileText,
  Layout,
  Image,
  Newspaper,
  FolderOpen,
  Users,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/rentals', icon: Repeat, label: 'Rentals' },
  { href: '/admin/quotes', icon: FileText, label: 'Quotes' },
  { href: '/admin/pages', icon: Layout, label: 'Pages' },
  { href: '/admin/banners', icon: Image, label: 'Banners' },
  { href: '/admin/news', icon: Newspaper, label: 'News' },
  { href: '/admin/media', icon: FolderOpen, label: 'Media' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#0066FF]/10 text-[#0066FF]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
