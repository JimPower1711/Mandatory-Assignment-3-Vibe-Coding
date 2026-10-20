import { AlertTriangle, X } from 'lucide-react'
import type { SavingsGoal } from '../../types/finance'
import { formatNok } from '../../utils/finance'

interface DeleteSavingsGoalDialogProps {
  goal: SavingsGoal
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteSavingsGoalDialog({ goal, onCancel, onConfirm }: DeleteSavingsGoalDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-midnight/85 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="w-full max-w-sm rounded-2xl border border-border bg-elevated p-6" role="alertdialog" aria-modal="true" aria-labelledby="delete-goal-title">
        <div className="flex items-start justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-danger/10 text-danger ring-1 ring-danger/20"><AlertTriangle size={20} /></span>
          <button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-muted/10 hover:text-foreground" aria-label="Close"><X size={17} /></button>
        </div>
        <h2 id="delete-goal-title" className="mt-5 text-xl font-semibold text-foreground">Delete savings goal?</h2>
        <p className="mt-2 text-sm leading-6 text-muted">This removes <span className="font-medium text-foreground">{goal.name}</span>, its {formatNok(goal.currentAmount)} saved balance, and its activity history from this device.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:bg-muted/10 hover:text-foreground">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-midnight transition-opacity duration-200 hover:opacity-90">Delete goal</button>
        </div>
      </section>
    </div>
  )
}
