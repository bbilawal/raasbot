import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

export default async function PagesPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, title, slug, is_published, published_at, updated_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load pages: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pages</h1>
        <p className="text-white/40 text-sm mt-1">{pages?.length ?? 0} pages</p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!pages || pages.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No pages found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Last Updated</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, i) => (
                  <tr
                    key={page.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 text-white font-medium">{page.title}</td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{page.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          page.is_published
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40">
                      {new Date(page.updated_at ?? page.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors w-fit"
                      >
                        <Pencil size={12} />
                        Edit
                      </Link>
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
