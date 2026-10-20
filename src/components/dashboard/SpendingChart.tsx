import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatNok } from '../../utils/finance'

const colors = ['#8b5cf6', '#22d3ee', '#f59e0b', '#fb7185', '#34d399', '#64748b']

interface CategoryPoint {
  name: string
  value: number
}

export function SpendingChart({ data }: { data: CategoryPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <article className="card-surface p-5 sm:p-6">
      <div>
        <p className="section-kicker">This month</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Spending breakdown</h2>
      </div>
      <div className="relative mx-auto mt-2 h-[185px] max-w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={76} paddingAngle={3} stroke="none">
              {data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip
              formatter={(value) => formatNok(Number(value))}
              contentStyle={{ background: '#121722', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">Total</p>
          <p className="mt-1 text-base font-semibold text-white">{formatNok(total)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {data.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="min-w-0 flex-1 truncate text-slate-500">{item.name}</span>
            <span className="font-medium text-slate-300">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </article>
  )
}
