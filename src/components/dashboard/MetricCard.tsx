import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  helper: string
  trend?: number
  icon: LucideIcon
  accent: 'emerald' | 'rose' | 'cyan'
}

const accentClasses = {
  emerald: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/15',
  rose: 'bg-rose-400/10 text-rose-300 ring-rose-400/15',
  cyan: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/15',
}

export function MetricCard({ label, value, helper, trend, icon: Icon, accent }: MetricCardProps) {
  const positive = trend !== undefined && trend >= 0
  return (
    <article className="card-surface group p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ring-1 ${accentClasses[accent]}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-white">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        <span className="text-slate-600">{helper}</span>
      </div>
    </article>
  )
}
