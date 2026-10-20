import { useEffect, useState } from 'react'
import { CalendarDays, Flag, PiggyBank, Target, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { SavingsGoal, SavingsGoalDraft } from '../../types/finance'
import { formatNok } from '../../utils/finance'

const colors = ['#8b5cf6', '#22d3ee', '#f59e0b', '#34d399', '#fb7185', '#60a5fa']

interface SavingsGoalFormModalProps {
  goal?: SavingsGoal | null
  availableBalance: number
  onClose: () => void
  onSave: (goal: SavingsGoalDraft) => void
}

export function SavingsGoalFormModal({ goal, availableBalance, onClose, onSave }: SavingsGoalFormModalProps) {
  const [name, setName] = useState(goal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount.toString() ?? '')
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount.toString() ?? '')
  const [deadline, setDeadline] = useState(goal?.deadline ?? '')
  const [color, setColor] = useState(goal?.color ?? colors[0])
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const target = Number(targetAmount)
    const current = goal ? goal.currentAmount : Number(currentAmount || 0)

    if (!name.trim()) {
      setError('Give your savings goal a name.')
      return
    }
    if (!Number.isFinite(target) || target <= 0) {
      setError('Target amount must be greater than zero.')
      return
    }
    if (!Number.isFinite(current) || current < 0) {
      setError('Starting amount cannot be negative.')
      return
    }
    if (!goal && current > availableBalance) {
      setError(`You have ${formatNok(availableBalance)} available for a starting deposit.`)
      return
    }
    if (!deadline) {
      setError('Choose a target date.')
      return
    }

    onSave({ name: name.trim(), targetAmount: target, currentAmount: current, deadline, color })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.09] bg-[#11151d] shadow-[0_30px_90px_rgba(0,0,0,0.6)]" role="dialog" aria-modal="true" aria-labelledby="goal-form-title">
        <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className="section-kicker">{goal ? 'Adjust the plan' : 'Plan something meaningful'}</p>
            <h2 id="goal-form-title" className="mt-1 text-xl font-semibold tracking-tight text-white">{goal ? 'Edit savings goal' : 'Create savings goal'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label htmlFor="goal-name" className="field-label">Goal name</label>
            <div className="relative mt-2">
              <Flag className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input id="goal-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={50} placeholder="e.g. Home deposit" className="form-control pl-10" autoFocus />
            </div>
          </div>

          <div className={`grid gap-5 ${goal ? '' : 'sm:grid-cols-2'}`}>
            <div>
              <label htmlFor="target-amount" className="field-label">Target amount</label>
              <div className="relative mt-2">
                <Target className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input id="target-amount" type="number" min="1" step="1" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} placeholder="50 000" className="form-control pl-10 pr-12" />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">NOK</span>
              </div>
            </div>
            {!goal && (
              <div>
                <label htmlFor="starting-amount" className="field-label">Starting amount <span className="font-normal text-slate-700">(optional)</span></label>
                <div className="relative mt-2">
                  <PiggyBank className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input id="starting-amount" type="number" min="0" step="1" value={currentAmount} onChange={(event) => setCurrentAmount(event.target.value)} placeholder="0" className="form-control pl-10 pr-12" />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">NOK</span>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-700">Up to {formatNok(availableBalance)} available</p>
              </div>
            )}
          </div>

          {goal && (
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
              <span className="text-xs text-slate-500">Currently saved</span>
              <span className="text-sm font-semibold text-white">{formatNok(goal.currentAmount)}</span>
            </div>
          )}

          <div>
            <label htmlFor="goal-deadline" className="field-label">Target date</label>
            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input id="goal-deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="form-control pl-10" />
            </div>
          </div>

          <fieldset>
            <legend className="field-label">Goal colour</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((option) => (
                <button key={option} type="button" onClick={() => setColor(option)} className={`grid size-9 place-items-center rounded-full transition-transform hover:scale-105 ${color === option ? 'ring-2 ring-white ring-offset-2 ring-offset-[#11151d]' : ''}`} style={{ backgroundColor: option }} aria-label={`Select colour ${option}`} aria-pressed={color === option}>
                  {color === option && <span className="size-2 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] px-3.5 py-2.5 text-xs text-rose-300">{error}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-5">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white">Cancel</button>
            <button type="submit" className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-400">{goal ? 'Save changes' : 'Create goal'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
