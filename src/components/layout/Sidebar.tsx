import {
  BarChart3,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Settings,
  Sparkles,
} from 'lucide-react'
import type { AppView } from '../../types/finance'

interface SidebarProps {
  currentView: AppView
  onSelect: (view: AppView) => void
}

const navItems = [
  { label: 'Overview', view: 'dashboard' as const, icon: LayoutDashboard },
  { label: 'Transactions', view: 'transactions' as const, icon: ReceiptText },
  { label: 'Savings goals', view: 'goals' as const, icon: PiggyBank },
  { label: 'Analytics', view: 'analytics' as const, icon: BarChart3 },
]

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-violet-500 text-white shadow-[0_0_28px_rgba(139,92,246,0.28)]">
        <span className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-700" />
        <Sparkles className="relative" size={18} strokeWidth={2.4} />
      </span>
      <div>
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">Wealth Tracker</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">Personal finance</p>
      </div>
    </div>
  )
}

export function Sidebar({ currentView, onSelect }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-white/[0.06] bg-[#090c12]/95 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <Brand />
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Main navigation">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Workspace</p>
        {navItems.map((item) => {
          const active = currentView === item.view
          const Icon = item.icon
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onSelect(item.view)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <span className={`grid size-8 place-items-center rounded-lg transition-colors ${active ? 'bg-violet-500/15 text-violet-300' : 'text-slate-600 group-hover:text-slate-400'}`}>
                <Icon size={17} />
              </span>
              <span className="flex-1">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        className="mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
      >
        <span className="grid size-8 place-items-center"><Settings size={17} /></span>
        Settings
      </button>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-500 text-xs font-bold text-slate-950">NH</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">Nora Hansen</p>
            <p className="truncate text-xs text-slate-600">Personal account</p>
          </div>
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" aria-label="Online" />
        </div>
      </div>
    </aside>
  )
}

export { navItems }
