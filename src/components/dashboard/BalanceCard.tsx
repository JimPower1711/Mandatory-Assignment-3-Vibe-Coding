import { ArrowUpRight, Eye, MoreHorizontal, WalletCards } from 'lucide-react'
import { formatNok } from '../../utils/finance'

interface BalanceCardProps {
  balance: number
  savings: number
}

export function BalanceCard({ balance, savings }: BalanceCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-violet-300/15 bg-[#171225] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.2)] sm:p-6">
      <div className="absolute -right-20 -top-24 size-64 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 size-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-200/70">
            <WalletCards size={16} />
            Available balance
          </div>
          <button type="button" aria-label="More balance options" className="grid size-8 place-items-center rounded-lg text-violet-200/50 transition-colors hover:bg-white/10 hover:text-white">
            <MoreHorizontal size={19} />
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <p className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-[36px]">{formatNok(balance)}</p>
          <Eye size={17} className="text-violet-300/50" />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-violet-200/40">Set aside in goals</p>
            <p className="mt-1 text-sm font-semibold text-violet-100">{formatNok(savings)}</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
            View accounts <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
