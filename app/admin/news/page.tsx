import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { DeleteNewsButton } from './DeleteNewsButton'

export default async function NewsPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('news_posts')
    .select('id, title, slug, published_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load news: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">News</h1>
          <p className="text-white/40 text-sm mt-1">{posts?.length ?? 0} articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] transition-colors"
        >
          <Plus size={16} />
          Add Article
        </Link>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!posts || posts.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No news articles yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Published</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Created</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 text-white font-medium max-w-[280px] truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{post.slug}</td>
                    <td className="px-4 py-3">
                      {post.published_at ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-white/5 text-white/30 border-white/10">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/40">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/${post.id}/edit`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </Link>
                        <DeleteNewsButton id={post.id} title={post.title} />
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
