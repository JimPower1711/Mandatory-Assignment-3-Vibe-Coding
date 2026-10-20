import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  helper: string
  trend?: number
  icon: LucideIcon
  accent: 'positive' | 'negative' | 'neutral'
}
const accentClasses = {
  positive: 'bg-positive/10 text-positive ring-positive/15',
  negative: 'bg-danger/10 text-danger ring-danger/15',
  neutral: 'bg-muted/10 text-muted ring-muted/15',
}

const valueClasses = {
  positive: 'text-positive',
  negative: 'text-danger',
  neutral: 'text-foreground',
}

export function MetricCard({ label, value, helper, trend, icon: Icon, accent }: MetricCardProps) {
  const trendUp = trend !== undefined && trend >= 0
  const favorableTrend = trend !== undefined && (accent === 'negative' ? trend <= 0 : trend >= 0)
  return (
    <article className="card-surface group p-5 transition-colors duration-200 hover:border-accent/30 xl:col-span-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ring-1 ${accentClasses[accent]}`}>
          <Icon size={17} />
        </span>
      </div>
      <p className={`mt-4 text-2xl font-semibold tracking-[-0.035em] tabular-nums ${valueClasses[accent]}`}>{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${favorableTrend ? 'text-positive' : 'text-danger'}`}>
            {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        <span className="text-muted">{helper}</span>
      </div>
    </article>
  )
}
