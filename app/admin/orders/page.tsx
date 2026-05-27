import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

const STATUS_OPTIONS = ['', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const { status } = await searchParams

  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('id, total_amount, status, created_at, customer_email, customer_name, currency')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: orders, error } = await query

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load orders: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-white/40 text-sm mt-1">{orders?.length ?? 0} orders</p>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((s) => (
            <Link
              key={s || 'all'}
              href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                (status ?? '') === s
                  ? 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/30'
                  : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {s || 'All'}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!orders || orders.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 font-mono text-white/70 text-xs">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-white/80">
                      <div>{order.customer_name || '—'}</div>
                      <div className="text-xs text-white/40">{order.customer_email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {order.currency?.toUpperCase() ?? 'CAD'}{' '}
                      {((order.total_amount ?? 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-white/40">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors"
                      >
                        View
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
