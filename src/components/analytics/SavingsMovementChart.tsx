import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyAnalytics } from '../../utils/analytics'
import { formatCompactNok, formatNok } from '../../utils/finance'

interface SavingsMovementChartProps {
  data: MonthlyAnalytics[]
  netMovement: number
}

export function SavingsMovementChart({ data, netMovement }: SavingsMovementChartProps) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Goal activity</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Savings movement</h2>
          <p className="mt-1 text-xs text-muted">Contributions compared with withdrawals</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted">Net movement</p>
          <p className={`mt-1 text-sm font-semibold tabular-nums ${netMovement >= 0 ? 'text-positive' : 'text-danger'}`}>{netMovement >= 0 ? '+' : '−'}{formatNok(Math.abs(netMovement))}</p>
        </div>
      </div>
      <div className="mt-6 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 2, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke="#292735" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9695AA', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <Tooltip contentStyle={{ background: '#1C1B29', border: '1px solid #292735', borderRadius: 12 }} itemStyle={{ color: '#F5F5F8' }} formatter={(value) => formatNok(Number(value))} cursor={{ fill: 'rgba(155,122,255,0.05)' }} />
            <Bar dataKey="contributions" name="Contributions" fill="#4ADEA0" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="withdrawals" name="Withdrawals" fill="#FF766C" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-center gap-5 text-[11px] text-muted">
        <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-positive" /> Contributions</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-danger" /> Withdrawals</span>
      </div>
    </article>
  )
}
