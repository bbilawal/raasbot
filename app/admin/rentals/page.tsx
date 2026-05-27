import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  const cls = map[status] ?? 'bg-white/5 text-white/40 border-white/10'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${cls}`}>
      {status}
    </span>
  )
}

export default async function RentalsPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select(`*, products(id, name, slug)`)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load rentals: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rentals</h1>
        <p className="text-white/40 text-sm mt-1">{rentals?.length ?? 0} rentals total</p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!rentals || rentals.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No rentals found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Product</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Period</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Start</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">End</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Deposit</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental, i) => {
                  const product = rental.products as { name?: string } | null
                  return (
                    <tr
                      key={rental.id}
                      className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                    >
                      <td className="px-4 py-3 text-white">
                        {product?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-white/60 capitalize">
                        {rental.rental_period ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {rental.start_date
                          ? new Date(rental.start_date).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {rental.end_date
                          ? new Date(rental.end_date).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={rental.status} />
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {rental.deposit_amount != null
                          ? `$${Number(rental.deposit_amount).toFixed(2)}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {rental.total_amount != null
                          ? `$${Number(rental.total_amount).toFixed(2)}`
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
