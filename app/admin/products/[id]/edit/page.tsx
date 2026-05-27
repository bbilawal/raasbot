import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { id } = await params

  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-white/40 text-sm mt-1">{product.name}</p>
      </div>

      <ProductForm mode="edit" initialData={product} />
    </div>
  )
}
