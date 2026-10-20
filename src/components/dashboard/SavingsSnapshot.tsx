import { ArrowRight, CalendarDays } from 'lucide-react'
import type { SavingsGoal } from '../../types/finance'
import { formatNok } from '../../utils/finance'

interface SavingsSnapshotProps {
  goals: SavingsGoal[]
  onViewAll: () => void
}
export function SavingsSnapshot({ goals, onViewAll }: SavingsSnapshotProps) {
  return (
    <article className="card-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-kicker">Building wealth</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Savings goals</h2>
        </div>
        <button type="button" onClick={onViewAll} className="grid size-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:border-accent/30 hover:text-accent" aria-label="View all savings goals">
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="mt-6 space-y-5">
        {goals.slice(0, 3).map((goal) => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
          return (
            <div key={goal.id}>
              <div className="mb-2.5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{goal.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted"><CalendarDays size={11} /> {new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(`${goal.deadline}T12:00:00`))}</p>
                </div>
                <p className="text-right text-xs text-muted"><span className="font-semibold text-foreground">{formatNok(goal.currentAmount)}</span> / {formatNok(goal.targetAmount)}</p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted/10">
                <div className="h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: goal.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
