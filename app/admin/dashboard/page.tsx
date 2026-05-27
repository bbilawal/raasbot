import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, Repeat, FileText } from 'lucide-react'

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

export default async function DashboardPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()

  const [
    { count: productCount },
    { count: orderCount },
    { count: rentalCount },
    { count: quoteCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('rentals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase
      .from('orders')
      .select('id, total_amount, status, created_at, customer_name, customer_email, currency')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Total Products',
      value: productCount ?? 0,
      icon: Package,
      href: '/admin/products',
      color: 'text-[#0066FF]',
      bg: 'bg-[#0066FF]/10',
    },
    {
      label: 'Total Orders',
      value: orderCount ?? 0,
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Active Rentals',
      value: rentalCount ?? 0,
      icon: Repeat,
      href: '/admin/rentals',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'New Quotes',
      value: quoteCount ?? 0,
      icon: FileText,
      href: '/admin/quotes',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/40">{label}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`${bg} p-2.5 rounded-xl`}>
                <Icon size={20} className={color} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#0066FF] hover:text-[#3385FF] transition-colors">
            View all
          </Link>
        </div>

        {!recentOrders || recentOrders.length === 0 ? (
          <p className="text-white/40 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-4 text-white/40 font-medium">Order ID</th>
                  <th className="text-left py-3 pr-4 text-white/40 font-medium">Customer</th>
                  <th className="text-left py-3 pr-4 text-white/40 font-medium">Amount</th>
                  <th className="text-left py-3 pr-4 text-white/40 font-medium">Status</th>
                  <th className="text-left py-3 text-white/40 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#0066FF] hover:text-[#3385FF] font-mono transition-colors"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-white/80">
                      {order.customer_name || order.customer_email || 'Unknown'}
                    </td>
                    <td className="py-3 pr-4 text-white">
                      {order.currency?.toUpperCase() ?? 'CAD'} {((order.total_amount ?? 0) / 100).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-white/40">
                      {new Date(order.created_at).toLocaleDateString()}
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
