import { AlertTriangle, X } from 'lucide-react'
import type { Transaction } from '../../types/finance'
import { formatNok } from '../../utils/finance'

interface DeleteTransactionDialogProps {
  transaction: Transaction
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteTransactionDialog({ transaction, onCancel, onConfirm }: DeleteTransactionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="w-full max-w-sm rounded-3xl border border-white/[0.09] bg-[#11151d] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)]" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="flex items-start justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/15"><AlertTriangle size={20} /></span>
          <button type="button" onClick={onCancel} className="grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-white/[0.05] hover:text-white" aria-label="Close"><X size={17} /></button>
        </div>
        <h2 id="delete-title" className="mt-5 text-xl font-semibold text-white">Delete transaction?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">This will permanently remove <span className="font-medium text-slate-300">{transaction.description}</span> ({formatNok(transaction.amount)}) from your local data.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/[0.05] hover:text-white">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400">Delete</button>
        </div>
      </section>
    </div>
  )
}
