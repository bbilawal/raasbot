import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BannerForm } from '@/components/admin/BannerForm'

export default async function NewBannerPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/banners"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Banners
        </Link>
        <h1 className="text-2xl font-bold text-white">Add Banner</h1>
      </div>

      <BannerForm mode="create" />
    </div>
  )
}
