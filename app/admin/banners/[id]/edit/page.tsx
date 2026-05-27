import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BannerForm } from '@/components/admin/BannerForm'

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { id } = await params

  const supabase = await createClient()
  const { data: banner, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !banner) {
    notFound()
  }

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
        <h1 className="text-2xl font-bold text-white">Edit Banner</h1>
        <p className="text-white/40 text-sm mt-1">{banner.title}</p>
      </div>

      <BannerForm
        mode="edit"
        initialData={{
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          image_url: banner.image_url,
          cta_text: banner.cta_text,
          cta_url: banner.cta_url,
          placement: banner.placement,
          display_order: banner.display_order,
          is_active: banner.is_active,
          starts_at: banner.starts_at,
          ends_at: banner.ends_at,
        }}
      />
    </div>
  )
}
