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
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Income vs expenses</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-positive" /> Income</span>
          <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-danger" /> Expenses</span>
        </div>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#292735" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <Tooltip
              cursor={{ stroke: 'rgba(155,122,255,0.22)', strokeDasharray: '4 4' }}
              contentStyle={{ background: '#1C1B29', border: '1px solid #292735', borderRadius: 12 }}
              labelStyle={{ color: '#9695AA', marginBottom: 6 }}
              itemStyle={{ color: '#F5F5F8' }}
              formatter={(value) => formatNok(Number(value))}
            />
            <Area type="monotone" dataKey="income" stroke="#4ADEA0" strokeWidth={2} fill="transparent" activeDot={{ r: 4, fill: '#4ADEA0', stroke: '#15151E', strokeWidth: 3 }} />
            <Area type="monotone" dataKey="expenses" stroke="#FF766C" strokeWidth={1.7} fill="transparent" activeDot={{ r: 4, fill: '#FF766C', stroke: '#15151E', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
