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
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Savings movement</h2>
          <p className="mt-1 text-xs text-slate-600">Contributions compared with withdrawals</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">Net movement</p>
          <p className={`mt-1 text-sm font-semibold ${netMovement >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{netMovement >= 0 ? '+' : '−'}{formatNok(Math.abs(netMovement))}</p>
        </div>
      </div>
      <div className="mt-6 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 2, left: -18, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(value) => formatCompactNok(Number(value))} />
            <Tooltip contentStyle={{ background: '#121722', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12 }} formatter={(value) => formatNok(Number(value))} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
            <Bar dataKey="contributions" name="Contributions" fill="#34d399" radius={[5, 5, 0, 0]} maxBarSize={30} />
            <Bar dataKey="withdrawals" name="Withdrawals" fill="#f59e0b" radius={[5, 5, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-center gap-5 text-[11px] text-slate-500">
        <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-emerald-400" /> Contributions</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-sm bg-amber-400" /> Withdrawals</span>
      </div>
    </article>
  )
}
