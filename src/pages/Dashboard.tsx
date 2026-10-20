import { Bell, CirclePlus, Landmark, ReceiptText, TrendingUp } from 'lucide-react'
import type { FinanceData, AppView } from '../types/finance'
import { getDashboardMetrics, getExpenseCategories, getMonthlyChartData, formatNok } from '../utils/finance'
import { BalanceCard } from '../components/dashboard/BalanceCard'
import { MetricCard } from '../components/dashboard/MetricCard'
import { OverviewChart } from '../components/dashboard/OverviewChart'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { SavingsSnapshot } from '../components/dashboard/SavingsSnapshot'
import { SpendingChart } from '../components/dashboard/SpendingChart'

interface DashboardProps {
  data: FinanceData
  onNavigate: (view: AppView) => void
}

export function Dashboard({ data, onNavigate }: DashboardProps) {
  const metrics = getDashboardMetrics(data)
  const chartData = getMonthlyChartData(data.transactions)
  const expenseCategories = getExpenseCategories(data.transactions)
  const reportLabel = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(metrics.reportingDate)

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">{reportLabel}</p>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">Welcome back, Nora</h1>
          <p className="mt-2 text-sm text-slate-500">Here’s the complete picture of your money today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="hidden size-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white lg:grid" aria-label="Notifications">
            <Bell size={17} />
          </button>
          <button type="button" onClick={() => onNavigate('transactions')} className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-400">
            <CirclePlus size={17} /> Add transaction
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard balance={metrics.availableBalance} savings={metrics.savingsTotal} />
        <MetricCard label="Monthly income" value={formatNok(metrics.monthlyIncome)} helper="received this month" icon={TrendingUp} accent="emerald" />
        <MetricCard label="Monthly expenses" value={formatNok(metrics.monthlyExpenses)} helper="compared with last month" trend={metrics.expenseChange} icon={ReceiptText} accent="rose" />
        <MetricCard label="Savings rate" value={`${metrics.savingsRate.toFixed(1)}%`} helper="of this month's income" icon={Landmark} accent="cyan" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.75fr)]">
        <OverviewChart data={chartData} />
        <SpendingChart data={expenseCategories} />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <RecentTransactions transactions={data.transactions} onViewAll={() => onNavigate('transactions')} />
        <SavingsSnapshot goals={data.savingsGoals} onViewAll={() => onNavigate('goals')} />
      </section>

      <p className="mt-6 text-center text-[11px] text-slate-700">Demo data only · Stored locally on this device · No bank connection</p>
    </div>
  )
}
