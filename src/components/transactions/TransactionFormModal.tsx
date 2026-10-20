import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, CalendarDays, CircleDollarSign, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Transaction, TransactionDraft, TransactionType } from '../../types/finance'

const categories: Record<TransactionType, string[]> = {
  income: ['Salary', 'Freelance', 'Investment', 'Other income'],
  expense: ['Housing', 'Groceries', 'Transport', 'Dining', 'Health', 'Insurance', 'Subscriptions', 'Lifestyle', 'Travel', 'Other'],
}

interface TransactionFormModalProps {
  transaction?: Transaction | null
  onClose: () => void
  onSave: (transaction: TransactionDraft) => void
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function TransactionFormModal({ transaction, onClose, onSave }: TransactionFormModalProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? '')
  const [category, setCategory] = useState(transaction?.category ?? 'Groceries')
  const [date, setDate] = useState(transaction?.date ?? getToday())
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const changeType = (nextType: TransactionType) => {
    setType(nextType)
    if (!categories[nextType].includes(category)) setCategory(categories[nextType][0])
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!description.trim()) {
      setError('Add a short description for the transaction.')
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (!date) {
      setError('Choose a transaction date.')
      return
    }

    onSave({ type, amount: parsedAmount, category, date, description: description.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.09] bg-[#11151d] shadow-[0_30px_90px_rgba(0,0,0,0.6)]" role="dialog" aria-modal="true" aria-labelledby="transaction-form-title">
        <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className="section-kicker">{transaction ? 'Update entry' : 'New entry'}</p>
            <h2 id="transaction-form-title" className="mt-1 text-xl font-semibold tracking-tight text-white">{transaction ? 'Edit transaction' : 'Add transaction'}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <fieldset>
            <legend className="field-label">Transaction type</legend>
            <div className="mt-2 grid grid-cols-2 rounded-xl bg-black/20 p-1">
              <button type="button" onClick={() => changeType('expense')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${type === 'expense' ? 'bg-rose-400/12 text-rose-300 shadow-sm ring-1 ring-rose-400/15' : 'text-slate-600 hover:text-slate-300'}`}>
                <ArrowUpRight size={16} /> Expense
              </button>
              <button type="button" onClick={() => changeType('income')} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${type === 'income' ? 'bg-emerald-400/12 text-emerald-300 shadow-sm ring-1 ring-emerald-400/15' : 'text-slate-600 hover:text-slate-300'}`}>
                <ArrowDownLeft size={16} /> Income
              </button>
            </div>
          </fieldset>

          <div>
            <label htmlFor="amount" className="field-label">Amount</label>
            <div className="relative mt-2">
              <CircleDollarSign className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
              <input id="amount" inputMode="decimal" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" className="form-control pl-10 pr-12 text-base font-semibold" autoFocus />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600">NOK</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="field-label">Category</label>
              <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="form-control mt-2">
                {categories[type].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="field-label">Date</label>
              <div className="relative mt-2">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="form-control pl-10" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="field-label">Description</label>
            <input id="description" type="text" maxLength={80} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={type === 'expense' ? 'e.g. Weekly groceries' : 'e.g. Monthly salary'} className="form-control mt-2" />
          </div>

          {error && <p className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] px-3.5 py-2.5 text-xs text-rose-300">{error}</p>}

          <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-5">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white">Cancel</button>
            <button type="submit" className="rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(139,92,246,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-400">
              {transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export { categories as transactionCategories }
