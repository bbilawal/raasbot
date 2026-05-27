import { cn } from '@/lib/utils'

type SpecsTableProps = {
  specs: Record<string, string>
  className?: string
}

export function SpecsTable({ specs, className }: SpecsTableProps) {
  const entries = Object.entries(specs)

  if (entries.length === 0) return null

  return (
    <div
      className={cn(
        'rounded-xl border border-white/8 overflow-hidden',
        className
      )}
    >
      <table className="w-full text-sm" aria-label="Product specifications">
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={cn(
                'border-b border-white/5 last:border-b-0',
                idx % 2 === 0 ? 'bg-[#111111]' : 'bg-[#0F0F0F]'
              )}
            >
              <th
                scope="row"
                className="px-5 py-3.5 text-left text-white/50 font-medium w-2/5 align-top"
              >
                {key}
              </th>
              <td className="px-5 py-3.5 text-white/90 align-top">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
