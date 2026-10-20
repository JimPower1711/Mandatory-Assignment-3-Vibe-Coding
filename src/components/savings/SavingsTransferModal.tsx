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
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.09] bg-[#11151d] shadow-[0_30px_90px_rgba(0,0,0,0.6)]" role="dialog" aria-modal="true" aria-labelledby="transfer-title">
        <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${contributing ? 'text-emerald-400' : 'text-amber-400'}`}>
              {contributing ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
              {contributing ? 'Add money' : 'Withdraw money'}
            </p>
            <h2 id="transfer-title" className="text-xl font-semibold tracking-tight text-white">{goal.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-white/[0.06] hover:text-white" aria-label="Close dialog"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
            <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Currently saved</span><span className="font-semibold text-white">{formatNok(goal.currentAmount)}</span></div>
            {contributing && <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-600">Available balance</span><span className="text-slate-400">{formatNok(availableBalance)}</span></div>}
            {!contributing && <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-600">Available to withdraw</span><span className="text-slate-400">{formatNok(goal.currentAmount)}</span></div>}
          </div>

          <div>
            <label htmlFor="transfer-amount" className="field-label">Amount</label>
            <div className="relative mt-2">
              <Coins className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
              <input id="transfer-amount" type="number" min="1" max={contributing ? Math.max(0, availableBalance) : goal.currentAmount} step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" className="form-control pl-10 pr-12 text-base font-semibold" autoFocus />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">NOK</span>
            </div>
          </div>

          <div>
            <label htmlFor="transfer-date" className="field-label">Date</label>
            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input id="transfer-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-control pl-10" />
            </div>
          </div>

          <div>
            <label htmlFor="transfer-note" className="field-label">Note <span className="font-normal text-slate-700">(optional)</span></label>
            <input id="transfer-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={70} placeholder={contributing ? 'e.g. Monthly transfer' : 'e.g. Unexpected expense'} className="form-control mt-2" />
          </div>

          {error && <p className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] px-3.5 py-2.5 text-xs text-rose-300">{error}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-5">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white">Cancel</button>
            <button type="submit" className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 ${contributing ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-amber-500 hover:bg-amber-400'}`}>
              {contributing ? 'Add to goal' : 'Withdraw'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
