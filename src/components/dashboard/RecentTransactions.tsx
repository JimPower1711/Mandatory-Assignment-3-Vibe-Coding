import {
  ArrowDownLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  HeartPulse,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  TrainFront,
  Utensils,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Transaction } from '../../types/finance'
import { formatDate, formatNok } from '../../utils/finance'

const categoryIcons: Record<string, LucideIcon> = {
  Salary: BriefcaseBusiness,
  Freelance: Sparkles,
  Housing: Building2,
  Groceries: ShoppingBasket,
  Transport: TrainFront,
  Dining: Utensils,
  Health: HeartPulse,
  Insurance: ShieldCheck,
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewAll: () => void
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  return (
    <article className="card-surface overflow-hidden">
      <div className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div>
          <p className="section-kicker">Latest activity</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Recent transactions</h2>
        </div>
        <button type="button" onClick={onViewAll} className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 transition-colors hover:text-violet-200">
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div>
        {recent.map((transaction) => {
          const Icon = categoryIcons[transaction.category] ?? (transaction.type === 'income' ? ArrowDownLeft : CreditCard)
          return (
            <div key={transaction.id} className="group flex items-center gap-3 border-t border-white/[0.055] px-5 py-3.5 transition-colors hover:bg-white/[0.025] sm:px-6">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${transaction.type === 'income' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.045] text-slate-400'}`}>
                <Icon size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">{transaction.description}</p>
                <p className="mt-0.5 text-xs text-slate-600">{transaction.category} · {formatDate(transaction.date)}</p>
              </div>
              <p className={`text-sm font-semibold tabular-nums ${transaction.type === 'income' ? 'text-emerald-300' : 'text-slate-200'}`}>
                {transaction.type === 'income' ? '+' : '−'}{formatNok(transaction.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </article>
  )
}
