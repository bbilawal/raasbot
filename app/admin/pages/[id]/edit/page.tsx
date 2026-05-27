import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PageEditForm } from './PageEditForm'

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { id } = await params

  const supabase = await createClient()
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  const contentStr =
    typeof page.content === 'string'
      ? page.content
      : page.content
        ? JSON.stringify(page.content, null, 2)
        : ''

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pages"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Pages
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Page</h1>
        <p className="text-white/40 text-sm mt-1">{page.title}</p>
      </div>

      <PageEditForm
        pageId={page.id}
        initialTitle={page.title ?? ''}
        initialSlug={page.slug ?? ''}
        initialContent={contentStr}
        initialMetaTitle={page.meta_title ?? ''}
        initialMetaDescription={page.meta_description ?? ''}
        initialIsPublished={page.is_published ?? false}
      />
    </div>
  )
}
