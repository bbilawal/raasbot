import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { DeleteBannerButton } from './DeleteBannerButton'

export default async function BannersPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: banners, error } = await supabase
    .from('banners')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load banners: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Banners</h1>
          <p className="text-white/40 text-sm mt-1">{banners?.length ?? 0} banners</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] transition-colors"
        >
          <Plus size={16} />
          Add Banner
        </Link>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!banners || banners.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No banners yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Placement</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">CTA</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Active</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Order</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner, i) => (
                  <tr
                    key={banner.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 text-white font-medium max-w-[200px] truncate">
                      {banner.title}
                    </td>
                    <td className="px-4 py-3 text-white/60 capitalize">
                      {banner.placement ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-white/60 max-w-[160px] truncate">
                      {banner.cta_text || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          banner.is_active
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{banner.display_order ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/banners/${banner.id}/edit`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </Link>
                        <DeleteBannerButton id={banner.id} title={banner.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
