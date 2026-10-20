import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Coins, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { SavingsGoal, SavingsTransferDraft, SavingsActivityType } from '../../types/finance'
import { formatNok } from '../../utils/finance'

interface SavingsTransferModalProps {
  goal: SavingsGoal
  type: SavingsActivityType
  availableBalance: number
  onClose: () => void
  onSave: (transfer: SavingsTransferDraft) => void
}

export function SavingsTransferModal({ goal, type, availableBalance, onClose, onSave }: SavingsTransferModalProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const contributing = type === 'contribution'

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (!contributing && parsedAmount > goal.currentAmount) {
      setError(`You can withdraw up to ${formatNok(goal.currentAmount)}.`)
      return
    }
    if (contributing && parsedAmount > availableBalance) {
      setError(`You have ${formatNok(availableBalance)} available to allocate.`)
      return
    }
    if (!date) {
      setError('Choose a transfer date.')
      return
    }

    onSave({ type, amount: parsedAmount, date, note: note.trim() || (contributing ? 'Savings contribution' : 'Savings withdrawal') })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-midnight/85 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <p className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${contributing ? 'text-positive' : 'text-danger'}`}>
              {contributing ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
              {contributing ? 'Add money' : 'Withdraw money'}
            </p>
            <h2 id="transfer-title" className="text-xl font-semibold tracking-tight text-foreground">{goal.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-muted/10 hover:text-foreground" aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="rounded-xl border border-border bg-midnight/35 px-4 py-3">
            <div className="flex items-center justify-between text-xs"><span className="text-muted">Currently saved</span><span className="font-semibold text-foreground tabular-nums">{formatNok(goal.currentAmount)}</span></div>
            {contributing && <div className="mt-2 flex items-center justify-between text-xs"><span className="text-muted">Available balance</span><span className="text-muted">{formatNok(availableBalance)}</span></div>}
            {!contributing && <div className="mt-2 flex items-center justify-between text-xs"><span className="text-muted">Available to withdraw</span><span className="text-muted">{formatNok(goal.currentAmount)}</span></div>}
          </div>

          <div>
            <label htmlFor="transfer-amount" className="field-label">Amount</label>
            <div className="relative mt-2">
              <Coins className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={17} />
              <input id="transfer-amount" type="number" min="1" max={contributing ? Math.max(0, availableBalance) : goal.currentAmount} step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" className="form-control pl-10 pr-12 text-base font-semibold" autoFocus />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">NOK</span>
            </div>
          </div>

          <div>
            <label htmlFor="transfer-date" className="field-label">Date</label>
            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input id="transfer-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-control pl-10" />
            </div>
          </div>

          <div>
            <label htmlFor="transfer-note" className="field-label">Note <span className="font-normal text-muted">(optional)</span></label>
            <input id="transfer-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={70} placeholder={contributing ? 'e.g. Monthly transfer' : 'e.g. Unexpected expense'} className="form-control mt-2" />
          </div>

          {error && <p className="rounded-xl border border-danger/20 bg-danger/[0.07] px-3.5 py-2.5 text-xs text-danger">{error}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:bg-muted/10 hover:text-foreground">Cancel</button>
            <button type="submit" className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-midnight duration-200 ${contributing ? 'bg-accent transition-colors hover:bg-accent-hover' : 'bg-danger transition-opacity hover:opacity-90'}`}>
              {contributing ? 'Add to goal' : 'Withdraw'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
