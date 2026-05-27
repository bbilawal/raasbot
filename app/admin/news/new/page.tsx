import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { NewsForm } from '@/components/admin/NewsForm'

export default async function NewNewsPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

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
        <h1 className="text-2xl font-bold text-white">Add Article</h1>
      </div>

      <NewsForm mode="create" />
    </div>
  )
}
