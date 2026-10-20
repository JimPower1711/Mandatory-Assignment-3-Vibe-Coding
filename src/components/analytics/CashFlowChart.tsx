import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyAnalytics } from '../../utils/analytics'
import { formatCompactNok, formatNok } from '../../utils/finance'

export function CashFlowChart({ data }: { data: MonthlyAnalytics[] }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Performance</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Cash-flow trend</h2>
          <p className="mt-1 text-xs text-slate-600">Monthly income, spending and net result</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-violet-400" /> Income</span>
          <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-cyan-400" /> Expenses</span>
          <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-emerald-400" /> Net</span>
        </div>
      </div>
      <div className="mt-6 h-[310px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 2, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.025)' }}
              contentStyle={{ background: '#121722', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}
              labelStyle={{ color: '#94a3b8', marginBottom: 6 }}
              formatter={(value) => formatNok(Number(value))}
            />
            <Bar dataKey="income" fill="#8b5cf6" radius={[5, 5, 0, 0]} maxBarSize={34} />
            <Bar dataKey="expenses" fill="#22d3ee" radius={[5, 5, 0, 0]} maxBarSize={34} />
            <Line type="monotone" dataKey="net" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: '#34d399', stroke: '#10151e', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#34d399', stroke: '#10151e', strokeWidth: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
