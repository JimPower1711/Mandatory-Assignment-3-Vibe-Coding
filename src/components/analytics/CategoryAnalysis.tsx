import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryAnalytics } from '../../utils/analytics'
import { formatNok } from '../../utils/finance'

const colors = [
  '#9B7AFF',
  '#7E63D3',
  '#B39AFF',
  '#6A55AD',
  '#9695AA',
  '#646274',
  'rgba(155, 122, 255, 0.58)',
  'rgba(150, 149, 170, 0.58)',
]

export function CategoryAnalysis({ data, total }: { data: CategoryAnalytics[]; total: number }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div>
        <p className="section-kicker">Where it went</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Expense categories</h2>
        <p className="mt-1 text-xs text-muted">Share of spending in this period</p>
      </div>
      {data.length ? (
        <>
          <div className="relative mx-auto h-[210px] max-w-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={64} outerRadius={86} paddingAngle={2.5} stroke="none">
                  {data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatNok(Number(value))} contentStyle={{ background: '#1C1B29', border: '1px solid #292735', borderRadius: 12 }} itemStyle={{ color: '#F5F5F8' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted">Spent</p>
              <p className="mt-1 text-base font-semibold text-foreground tabular-nums">{formatNok(total)}</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 text-xs">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="min-w-0 flex-1 truncate text-muted">{item.name}</span>
                <span className="font-medium text-foreground tabular-nums">{formatNok(item.value)}</span>
                <span className="w-10 text-right text-muted">{item.share.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid h-[300px] place-items-center text-sm text-muted">No expenses in this period</div>
      )}
    </article>
  )
}
