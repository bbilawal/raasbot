import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { QuoteViewDialog, QuoteStatusSelect } from './QuoteActions'

export default async function QuotesPage() {
  const auth = await requireAdmin()
  if (!auth) redirect('/admin/login')

  const supabase = await createClient()
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-400 text-sm">Failed to load quotes: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quotes</h1>
        <p className="text-white/40 text-sm mt-1">{quotes?.length ?? 0} quote requests</p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        {!quotes || quotes.length === 0 ? (
          <div className="p-6 text-white/40 text-sm">No quote requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Company</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Interest</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote, i) => (
                  <tr
                    key={quote.id}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-4 py-3 text-white font-medium">{quote.name || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{quote.email || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{quote.company || '—'}</td>
                    <td className="px-4 py-3 text-white/60 max-w-[160px] truncate">
                      {quote.product_interest || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <QuoteStatusSelect quoteId={quote.id} currentStatus={quote.status} />
                    </td>
                    <td className="px-4 py-3 text-white/40">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <QuoteViewDialog
                        quote={{
                          name: quote.name,
                          email: quote.email,
                          company: quote.company,
                          phone: quote.phone,
                          message: quote.message,
                          product_interest: quote.product_interest,
                          created_at: quote.created_at,
                        }}
                      />
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
