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
export const navItems = [
  { label: 'Overview', view: 'dashboard' as const, icon: LayoutDashboard },
  { label: 'Transactions', view: 'transactions' as const, icon: ReceiptText },
  { label: 'Savings goals', view: 'goals' as const, icon: PiggyBank },
  { label: 'Analytics', view: 'analytics' as const, icon: BarChart3 },
]

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl border border-accent/25 bg-accent-muted text-accent-hover">
        <Sparkles size={18} strokeWidth={2.1} />
      </span>
      <div>
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">Wealth Tracker</p>
        <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted">Personal finance</p>
      </div>
    </div>
  )
}

export function Sidebar({ currentView, onSelect }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
      <div className="px-2">
        <Brand />
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Main navigation">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Workspace</p>
        {navItems.map((item) => {
          const active = currentView === item.view
          const Icon = item.icon
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onSelect(item.view)}
              className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'border-accent/20 bg-accent-muted text-foreground'
                  : 'border-transparent text-muted hover:bg-elevated hover:text-foreground'
              }`}
            >
              <span className={`grid size-8 place-items-center rounded-lg transition-colors ${active ? 'bg-accent/10 text-accent-hover' : 'text-muted group-hover:text-foreground'}`}>
                <Icon size={17} />
              </span>
              <span className="flex-1">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        className="mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-foreground"
      >
        <span className="grid size-8 place-items-center"><Settings size={17} /></span>
        Settings
      </button>

      <div className="rounded-[14px] border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-accent-muted text-xs font-bold text-accent-hover">NH</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">Nora Hansen</p>
            <p className="truncate text-xs text-muted">Personal account</p>
          </div>
          <span className="size-2 rounded-full bg-positive" aria-label="Online" />
        </div>
      </div>
    </aside>
  )
}
