import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { NewsForm } from '@/components/admin/NewsForm'

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { id } = await params

  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/news"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to News
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Article</h1>
        <p className="text-white/40 text-sm mt-1">{post.title}</p>
      </div>

      <NewsForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image_url: post.cover_image_url,
          tags: post.tags,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          published_at: post.published_at,
        }}
      />
    </div>
  )
}
