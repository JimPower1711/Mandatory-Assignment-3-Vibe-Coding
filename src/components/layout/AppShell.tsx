import type { ReactNode } from 'react'
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
    <div className="min-h-screen bg-midnight text-foreground">
      <Sidebar currentView={currentView} onSelect={onSelect} />
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-sidebar px-5 lg:hidden">
        <Brand />
      </header>
      <main className="min-h-screen pb-28 lg:ml-[248px] lg:pb-0">{children}</main>
      <MobileNav currentView={currentView} onSelect={onSelect} />
    </div>
  )
}
