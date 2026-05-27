import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { OrderStatusForm } from './OrderStatusForm'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    refunded: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  const cls = map[status] ?? 'bg-white/5 text-white/40 border-white/10'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${cls}`}>
      {status}
    </span>
  )
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { id } = await params

  const supabase = await createClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select(`*, order_items(id, product_id, product_name, quantity, unit_price, total_price)`)
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const shippingAddress = order.shipping_address as Record<string, string> | null

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            Order <span className="font-mono text-white/60">#{order.id.slice(0, 8)}</span>
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-white/40 text-sm mt-1">
          Placed on {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {/* Customer Info */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Customer</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-white/40">Name</dt>
            <dd className="text-white mt-0.5">{order.customer_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-white/40">Email</dt>
            <dd className="text-white mt-0.5">{order.customer_email || '—'}</dd>
          </div>
          {shippingAddress && (
            <div className="col-span-2">
              <dt className="text-white/40">Shipping Address</dt>
              <dd className="text-white mt-0.5">
                {[
                  shippingAddress.line1,
                  shippingAddress.line2,
                  shippingAddress.city,
                  shippingAddress.state,
                  shippingAddress.postal_code,
                  shippingAddress.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </dd>
            </div>
          )}
          {order.tracking_number && (
            <div className="col-span-2">
              <dt className="text-white/40">Tracking</dt>
              <dd className="text-white font-mono mt-0.5">{order.tracking_number}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Order Items */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Items</h2>
        {!order.order_items || order.order_items.length === 0 ? (
          <p className="text-white/40 text-sm">No items.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white/40 font-medium">Product</th>
                <th className="text-left py-2 pr-4 text-white/40 font-medium">Qty</th>
                <th className="text-left py-2 pr-4 text-white/40 font-medium">Unit</th>
                <th className="text-right py-2 text-white/40 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map(
                (item: {
                  id: string
                  product_name: string
                  quantity: number
                  unit_price: number
                  total_price: number
                }) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-white">{item.product_name}</td>
                    <td className="py-3 pr-4 text-white/60">{item.quantity}</td>
                    <td className="py-3 pr-4 text-white/60">
                      ${((item.unit_price ?? 0) / 100).toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-white font-medium">
                      ${((item.total_price ?? 0) / 100).toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-right font-semibold text-white/60 text-sm">
                  Total
                </td>
                <td className="pt-3 text-right font-bold text-white">
                  {order.currency?.toUpperCase() ?? 'CAD'}{' '}
                  {((order.total_amount ?? 0) / 100).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Status Update */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Update Order</h2>
        <OrderStatusForm
          orderId={order.id}
          currentStatus={order.status}
          currentTracking={order.tracking_number ?? null}
        />
      </div>
    </div>
  )
}
