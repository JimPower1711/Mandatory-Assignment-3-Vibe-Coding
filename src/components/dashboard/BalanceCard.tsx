import { ArrowUpRight, Eye, WalletCards } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import type { SavingsActivity } from '../../types/finance'
import { formatNok } from '../../utils/finance'

interface BalanceCardProps {
  balance: number
  savings: number
  chartData: Array<{ key: string; month: string; income: number; expenses: number }>
  savingsActivities: SavingsActivity[]
}
export function BalanceCard({ balance, savings, chartData, savingsActivities }: BalanceCardProps) {
  const contributionByMonth = new Map<string, number>()
  for (const activity of savingsActivities) {
    const key = activity.date.slice(0, 7)
    const change = activity.type === 'contribution' ? activity.amount : -activity.amount
    contributionByMonth.set(key, (contributionByMonth.get(key) ?? 0) + change)
  }

  const changes = chartData.map((month) => month.income - month.expenses - (contributionByMonth.get(month.key) ?? 0))
  let runningBalance = balance - changes.reduce((sum, value) => sum + value, 0)
  const trendData = chartData.map((month, index) => {
    runningBalance += changes[index]
    return { month: month.month, balance: runningBalance }
  })

  return (
    <article className="card-surface relative min-h-[170px] overflow-hidden p-5 sm:p-6 xl:col-span-6">
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <WalletCards size={17} className="text-accent" />
          Available balance
        </div>
        <Eye size={17} className="text-muted" />
      </div>

      <div className="relative z-10 mt-5">
        <p className="text-3xl font-semibold tracking-[-0.045em] text-foreground tabular-nums sm:text-[36px]">{formatNok(balance)}</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Set aside in goals</p>
            <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{formatNok(savings)}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-border bg-elevated px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent-hover">
            View accounts <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 top-8 w-[48%] opacity-70" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
            <Area type="monotone" dataKey="balance" stroke="#9B7AFF" strokeWidth={2} fill="#9B7AFF" fillOpacity={0.08} dot={false} activeDot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
