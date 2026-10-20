import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompactNok, formatNok } from '../../utils/finance'

interface ChartPoint {
  month: string
  income: number
  expenses: number
}

export function OverviewChart({ data }: { data: ChartPoint[] }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Cash flow</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Income vs expenses</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-violet-400" /> Income</span>
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-cyan-400" /> Expenses</span>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeDasharray: '4 4' }}
              contentStyle={{ background: '#121722', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}
              labelStyle={{ color: '#94a3b8', marginBottom: 6 }}
              formatter={(value) => formatNok(Number(value))}
            />
            <Area type="monotone" dataKey="income" stroke="#a78bfa" strokeWidth={2.5} fill="url(#incomeGradient)" activeDot={{ r: 4, fill: '#a78bfa', stroke: '#171225', strokeWidth: 3 }} />
            <Area type="monotone" dataKey="expenses" stroke="#22d3ee" strokeWidth={2} fill="url(#expenseGradient)" activeDot={{ r: 4, fill: '#22d3ee', stroke: '#111827', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
