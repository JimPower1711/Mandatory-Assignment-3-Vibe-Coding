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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="w-full max-w-sm rounded-3xl border border-white/[0.09] bg-[#11151d] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)]" role="alertdialog" aria-modal="true" aria-labelledby="delete-goal-title">
        <div className="flex items-start justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/15"><AlertTriangle size={20} /></span>
          <button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-white/[0.05] hover:text-white" aria-label="Close"><X size={17} /></button>
        </div>
        <h2 id="delete-goal-title" className="mt-5 text-xl font-semibold text-white">Delete savings goal?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">This removes <span className="font-medium text-slate-300">{goal.name}</span>, its {formatNok(goal.currentAmount)} saved balance, and its activity history from this device.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400">Delete goal</button>
        </div>
      </section>
    </div>
  )
}
