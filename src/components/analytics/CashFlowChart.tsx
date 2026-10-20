import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyAnalytics } from '../../utils/analytics'
import { formatCompactNok, formatNok } from '../../utils/finance'

export function CashFlowChart({ data }: { data: MonthlyAnalytics[] }) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Performance</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Cash-flow trend</h2>
          <p className="mt-1 text-xs text-muted">Monthly income, spending and net result</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-positive" /> Income</span>
          <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-danger" /> Expenses</span>
          <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-foreground" /> Net</span>
        </div>
      </div>
      <div className="mt-6 h-[310px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 2, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke="#292735" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <ReferenceLine y={0} stroke="#292735" />
            <Tooltip
              cursor={{ fill: 'rgba(150,149,170,0.05)' }}
              contentStyle={{ background: '#1C1B29', border: '1px solid #292735', borderRadius: 12 }}
              labelStyle={{ color: '#9695AA', marginBottom: 6 }}
              itemStyle={{ color: '#F5F5F8' }}
              formatter={(value) => formatNok(Number(value))}
            />
            <Bar dataKey="income" fill="#4ADEA0" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="expenses" fill="#FF766C" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Line type="monotone" dataKey="net" stroke="#9B7AFF" strokeWidth={1.7} dot={{ r: 3, fill: '#9B7AFF', stroke: '#15151E', strokeWidth: 2 }} activeDot={{ r: 4, fill: '#B39AFF', stroke: '#15151E', strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
