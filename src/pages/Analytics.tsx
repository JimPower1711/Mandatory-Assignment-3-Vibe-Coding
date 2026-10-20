import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  CircleDollarSign,
  Lightbulb,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  WalletCards,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CashFlowChart } from '../components/analytics/CashFlowChart'
import { CategoryAnalysis } from '../components/analytics/CategoryAnalysis'
import { SavingsMovementChart } from '../components/analytics/SavingsMovementChart'
import type { FinanceData } from '../types/finance'
import { getAnalytics } from '../utils/analytics'
import type { AnalyticsPeriod } from '../utils/analytics'
import { formatNok } from '../utils/finance'

const periods: { value: AnalyticsPeriod; label: string }[] = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 'all', label: 'All time' },
]

export function Analytics({ data }: { data: FinanceData }) {
  const [period, setPeriod] = useState<AnalyticsPeriod>(6)
  const analytics = useMemo(() => getAnalytics(data, period), [data, period])

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Financial intelligence</p>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">Analytics</h1>
          <p className="mt-2 text-sm text-muted">Understand the patterns behind every krone.</p>
        </div>
        <div className="flex rounded-xl border border-border bg-card p-1" aria-label="Analytics period">
          {periods.map((option) => (
            <button key={option.label} type="button" onClick={() => setPeriod(option.value)} className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${period === option.value ? 'bg-accent-muted text-accent ring-1 ring-accent/25' : 'text-muted hover:text-foreground'}`} aria-pressed={period === option.value}>
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-4 flex items-center gap-2 text-xs text-muted">
        <CalendarRange size={14} /> Analysing {analytics.periodLabel}
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetric label="Total income" value={formatNok(analytics.totalIncome)} helper={`${analytics.monthly.length} month period`} icon={TrendingUp} tone="positive" />
        <AnalyticsMetric label="Total spending" value={formatNok(analytics.totalExpenses)} helper={`${analytics.expenseTrend >= 0 ? '+' : '−'}${Math.abs(analytics.expenseTrend).toFixed(1)}% in latest month`} icon={TrendingDown} tone="negative" />
        <AnalyticsMetric label="Net cash flow" value={formatNok(analytics.netCashFlow)} helper={`${analytics.cashFlowMargin.toFixed(1)}% cash-flow margin`} icon={WalletCards} tone="accent" />
        <AnalyticsMetric label="Average spending" value={formatNok(analytics.averageMonthlySpend)} helper="Per month in this period" icon={CircleDollarSign} tone="neutral" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
        <CashFlowChart data={analytics.monthly} />
        <CategoryAnalysis data={analytics.categories} total={analytics.totalExpenses} />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <SavingsMovementChart data={analytics.monthly} netMovement={analytics.netSavingsMovement} />
        <article className="card-surface p-5 sm:p-6">
          <div>
            <p className="section-kicker">Calculated from your data</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Key insights</h2>
          </div>
          <div className="mt-5 space-y-3">
            <Insight
              icon={analytics.expenseTrend <= 0 ? ArrowDownRight : ArrowUpRight}
              tone={analytics.expenseTrend <= 0 ? 'positive' : 'negative'}
              title={analytics.expenseTrend <= 0 ? 'Spending is trending down' : 'Spending increased'}
              text={`Latest-month expenses are ${Math.abs(analytics.expenseTrend).toFixed(1)}% ${analytics.expenseTrend <= 0 ? 'lower' : 'higher'} than the month before.`}
            />
            <Insight
              icon={Trophy}
              tone="accent"
              title={analytics.bestMonth ? `${analytics.bestMonth.fullMonth} led cash flow` : 'No cash-flow activity yet'}
              text={analytics.bestMonth ? `Your strongest monthly net result was ${formatNok(analytics.bestMonth.net)}.` : 'Add transactions to reveal your strongest month.'}
            />
            <Insight
              icon={analytics.topCategory ? CircleDollarSign : Lightbulb}
              tone="neutral"
              title={analytics.topCategory ? `${analytics.topCategory.name} is the largest category` : 'No expense pattern yet'}
              text={analytics.topCategory ? `${formatNok(analytics.topCategory.value)} accounts for ${analytics.topCategory.share.toFixed(0)}% of period spending.` : 'Expense categories will appear as transactions are added.'}
            />
            <Insight
              icon={Target}
              tone="muted"
              title={`${analytics.goalProgress.toFixed(1)}% of goal targets funded`}
              text={`${formatNok(analytics.totalSaved)} is currently allocated across your savings goals.`}
            />
          </div>
        </article>
      </section>

      <MonthlySummary data={analytics.monthly} />
      <p className="mt-5 text-center text-[11px] text-muted">Insights use local transaction and savings data only · No external financial service</p>
    </div>
  )
}

interface MetricProps {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: 'positive' | 'negative' | 'accent' | 'neutral'
}

const metricTones = {
  positive: 'bg-positive/10 text-positive',
  negative: 'bg-danger/10 text-danger',
  accent: 'bg-accent/10 text-accent',
  neutral: 'bg-muted/10 text-muted',
}

const metricValueTones = {
  positive: 'text-positive',
  negative: 'text-danger',
  accent: 'text-accent',
  neutral: 'text-foreground',
}

function AnalyticsMetric({ label, value, helper, icon: Icon, tone }: MetricProps) {
  return (
    <article className="card-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${metricTones[tone]}`}><Icon size={17} /></span>
      </div>
      <p className={`mt-4 truncate text-2xl font-semibold tracking-[-0.035em] tabular-nums ${metricValueTones[tone]}`}>{value}</p>
      <p className="mt-2 text-xs text-muted">{helper}</p>
    </article>
  )
}

interface InsightProps {
  icon: LucideIcon
  tone: 'positive' | 'negative' | 'accent' | 'neutral' | 'muted'
  title: string
  text: string
}

const insightTones = {
  positive: 'bg-positive/10 text-positive',
  negative: 'bg-danger/10 text-danger',
  accent: 'bg-accent/10 text-accent',
  neutral: 'bg-muted/10 text-muted',
  muted: 'bg-foreground/10 text-foreground',
}

function Insight({ icon: Icon, tone, title, text }: InsightProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-midnight/25 p-3.5">
      <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${insightTones[tone]}`}><Icon size={16} /></span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
      </div>
    </div>
  )
}

function MonthlySummary({ data }: { data: ReturnType<typeof getAnalytics>['monthly'] }) {
  return (
    <article className="card-surface mt-4 overflow-hidden">
      <div className="px-5 py-5 sm:px-6">
        <p className="section-kicker">Period detail</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Monthly summary</h2>
      </div>
      <div className="hidden grid-cols-[1fr_repeat(4,minmax(120px,0.7fr))] gap-4 border-t border-border px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:grid">
        <span>Month</span><span className="text-right">Income</span><span className="text-right">Expenses</span><span className="text-right">Net</span><span className="text-right">Goal movement</span>
      </div>
      <div>
        {[...data].reverse().map((month) => {
          const goalMovement = month.contributions - month.withdrawals
          return (
            <div key={month.key} className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-border px-5 py-4 text-sm transition-colors hover:bg-accent/5 sm:px-6 md:grid-cols-[1fr_repeat(4,minmax(120px,0.7fr))] md:gap-4">
              <p className="col-span-2 font-medium text-foreground md:col-span-1">{month.fullMonth}</p>
              <Value label="Income" value={month.income} tone="positive" />
              <Value label="Expenses" value={month.expenses} />
              <Value label="Net" value={month.net} tone={month.net >= 0 ? 'positive' : 'negative'} />
              <Value label="Goal movement" value={goalMovement} tone={goalMovement >= 0 ? 'accent' : 'negative'} prefix={goalMovement > 0 ? '+' : undefined} />
            </div>
          )
        })}
      </div>
    </article>
  )
}

function Value({ label, value, tone = 'default', prefix }: { label: string; value: number; tone?: 'default' | 'positive' | 'negative' | 'accent'; prefix?: string }) {
  const classes = {
    default: 'text-foreground/85',
    positive: 'text-positive',
    negative: 'text-danger',
    accent: 'text-accent',
  }
  return (
    <div className="md:text-right">
      <p className="text-[10px] uppercase tracking-wider text-muted md:hidden">{label}</p>
      <p className={`mt-0.5 font-medium tabular-nums md:mt-0 ${classes[tone]}`}>{prefix}{formatNok(value)}</p>
    </div>
  )
}
