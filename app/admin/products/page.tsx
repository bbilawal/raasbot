import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { DeleteProductButton } from './DeleteProductButton'

export default async function ProductsPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select(`*, product_categories(id, name, slug)`)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="text-red-400 text-sm">Failed to load products: {error.message}</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm mt-1">{products?.length ?? 0} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052CC] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Rental</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">In Stock</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Featured</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      <div>{product.name}</div>
                      {product.slug && (
                        <div className="text-xs text-white/30 font-normal">{product.slug}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {(product.product_categories as { name?: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {product.price != null ? `$${Number(product.price).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          product.rental_available
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        {product.rental_available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          (product.stock_quantity ?? 0) > 0 || product.is_active
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {product.stock_quantity ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                          product.is_featured
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        {product.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
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
