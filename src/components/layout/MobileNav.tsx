import type { AppView } from '../../types/finance'
import { navItems } from './Sidebar'

interface MobileNavProps {
  currentView: AppView
  onSelect: (view: AppView) => void
}

export function MobileNav({ currentView, onSelect }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-white/[0.09] bg-[#11151d]/95 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      {navItems.map(({ label, view, icon: Icon }) => {
        const active = view === currentView
        return (
          <button
            key={view}
            type="button"
            onClick={() => onSelect(view)}
            className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-colors ${active ? 'bg-violet-500/15 text-violet-300' : 'text-slate-600'}`}
          >
            <Icon size={18} />
            <span>{label.split(' ')[0]}</span>
          </button>
        )
      })}
    </nav>
  )
}
