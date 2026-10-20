import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategoryAnalytics } from '../../utils/analytics'
import { formatNok } from '../../utils/finance'

const colors = ['#8b5cf6', '#22d3ee', '#f59e0b', '#fb7185', '#34d399', '#60a5fa', '#a78bfa', '#64748b']

export function CategoryAnalysis({ data, total }: { data: CategoryAnalytics[]; total: number }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div>
        <p className="section-kicker">Where it went</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Expense categories</h2>
        <p className="mt-1 text-xs text-slate-600">Share of spending in this period</p>
      </div>
      {data.length ? (
        <>
          <div className="relative mx-auto h-[210px] max-w-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={64} outerRadius={86} paddingAngle={2.5} stroke="none">
                  {data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatNok(Number(value))} contentStyle={{ background: '#121722', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">Spent</p>
              <p className="mt-1 text-base font-semibold text-white">{formatNok(total)}</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center gap-3 text-xs">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="min-w-0 flex-1 truncate text-slate-500">{item.name}</span>
                <span className="font-medium text-slate-300">{formatNok(item.value)}</span>
                <span className="w-10 text-right text-slate-600">{item.share.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid h-[300px] place-items-center text-sm text-slate-600">No expenses in this period</div>
      )}
    </article>
  )
}
