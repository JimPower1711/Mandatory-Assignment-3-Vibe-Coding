import type { ReactNode } from 'react'
import { Bell } from 'lucide-react'
import type { AppView } from '../../types/finance'
import { MobileNav } from './MobileNav'
import { Brand, Sidebar } from './Sidebar'

interface AppShellProps {
  children: ReactNode
  currentView: AppView
  onSelect: (view: AppView) => void
}

export function AppShell({ children, currentView, onSelect }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#080b10] text-slate-100">
      <Sidebar currentView={currentView} onSelect={onSelect} />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080b10]/85 px-5 backdrop-blur-xl lg:hidden">
        <Brand />
        <button type="button" className="relative grid size-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400" />
        </button>
      </header>
      <main className="min-h-screen pb-28 lg:ml-[248px] lg:pb-0">{children}</main>
      <MobileNav currentView={currentView} onSelect={onSelect} />
    </div>
  )
}
