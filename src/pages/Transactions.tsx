import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CirclePlus,
  Filter,
  Pencil,
  Search,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react'
import { DeleteTransactionDialog } from '../components/transactions/DeleteTransactionDialog'
import { TransactionFormModal, transactionCategories } from '../components/transactions/TransactionFormModal'
import type { Transaction, TransactionDraft, TransactionType } from '../types/finance'
import { formatDate, formatNok } from '../utils/finance'

type TypeFilter = 'all' | TransactionType

interface TransactionsProps {
  transactions: Transaction[]
  onAdd: (transaction: TransactionDraft) => void
  onUpdate: (id: string, transaction: TransactionDraft) => void
  onDelete: (id: string) => void
}

export function Transactions({ transactions, onAdd, onUpdate, onDelete }: TransactionsProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const allCategories = useMemo(() => {
    const available = typeFilter === 'all'
      ? [...transactionCategories.income, ...transactionCategories.expense]
      : transactionCategories[typeFilter]
    return [...new Set(available)].sort()
  }, [typeFilter])

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return [...transactions]
      .filter((item) => typeFilter === 'all' || item.type === typeFilter)
      .filter((item) => categoryFilter === 'all' || item.category === categoryFilter)
      .filter((item) => !normalizedQuery || `${item.description} ${item.category}`.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  }, [transactions, typeFilter, categoryFilter, query])

  const totals = useMemo(() => filteredTransactions.reduce(
    (result, item) => ({
      income: result.income + (item.type === 'income' ? item.amount : 0),
      expenses: result.expenses + (item.type === 'expense' ? item.amount : 0),
    }),
    { income: 0, expenses: 0 },
  ), [filteredTransactions])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction)
    setFormOpen(true)
  }

  const handleSave = (draft: TransactionDraft) => {
    if (editing) onUpdate(editing.id, draft)
    else onAdd(draft)
    setFormOpen(false)
    setEditing(null)
  }

  const setType = (type: TypeFilter) => {
    setTypeFilter(type)
    if (type !== 'all' && categoryFilter !== 'all' && !transactionCategories[type].includes(categoryFilter)) {
      setCategoryFilter('all')
    }
  }

  const clearFilters = () => {
    setTypeFilter('all')
    setCategoryFilter('all')
    setQuery('')
  }

  const hasFilters = typeFilter !== 'all' || categoryFilter !== 'all' || query.trim() !== ''

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Money activity</p>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">Transactions</h1>
          <p className="mt-2 text-sm text-slate-500">Keep every krone categorized and accounted for.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.2)] transition-all hover:-translate-y-0.5 hover:bg-violet-400">
          <CirclePlus size={17} /> Add transaction
        </button>
      </header>

      <section className="mb-4 grid gap-3 sm:grid-cols-3">
        <Summary label="Filtered income" value={totals.income} icon={ArrowDownLeft} tone="emerald" />
        <Summary label="Filtered expenses" value={totals.expenses} icon={ArrowUpRight} tone="rose" />
        <Summary label="Net cash flow" value={totals.income - totals.expenses} icon={WalletCards} tone="violet" />
      </section>

      <section className="card-surface overflow-hidden">
        <div className="border-b border-white/[0.06] p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={17} />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" className="form-control pl-10" aria-label="Search transactions" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex rounded-xl bg-black/20 p-1" aria-label="Filter by transaction type">
                {(['all', 'income', 'expense'] as TypeFilter[]).map((type) => (
                  <button key={type} type="button" onClick={() => setType(type)} className={`flex-1 rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition-colors sm:flex-none ${typeFilter === type ? 'bg-white/[0.08] text-white shadow-sm' : 'text-slate-600 hover:text-slate-300'}`}>{type}</button>
                ))}
              </div>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={15} />
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="form-control min-w-44 pl-10 text-xs font-semibold" aria-label="Filter by category">
                  <option value="all">All categories</option>
                  {allCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(220px,1.4fr)_minmax(130px,0.7fr)_100px_130px_84px] gap-4 border-b border-white/[0.055] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 md:grid">
          <span>Description</span><span>Category</span><span>Date</span><span className="text-right">Amount</span><span />
        </div>

        {filteredTransactions.length ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="group flex items-center gap-3 border-b border-white/[0.05] px-4 py-4 last:border-b-0 hover:bg-white/[0.02] sm:px-5 md:grid md:grid-cols-[minmax(220px,1.4fr)_minmax(130px,0.7fr)_100px_130px_84px] md:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${transaction.type === 'income' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/[0.08] text-rose-300'}`}>
                    {transaction.type === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{transaction.description}</p>
                    <p className="mt-0.5 text-xs capitalize text-slate-600 md:hidden">{transaction.category} · {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <span className="hidden text-sm text-slate-500 md:block">{transaction.category}</span>
                <span className="hidden text-sm text-slate-500 md:block">{formatDate(transaction.date)}</span>
                <p className={`ml-auto text-right text-sm font-semibold tabular-nums md:ml-0 ${transaction.type === 'income' ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {transaction.type === 'income' ? '+' : '−'}{formatNok(transaction.amount)}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <button type="button" onClick={() => openEdit(transaction)} className="grid size-8 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.06] hover:text-slate-200" aria-label={`Edit ${transaction.description}`}><Pencil size={14} /></button>
                  <button type="button" onClick={() => setDeleting(transaction)} className="grid size-8 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-rose-400/10 hover:text-rose-300" aria-label={`Delete ${transaction.description}`}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[0.04] text-slate-600"><Search size={20} /></span>
            <h2 className="mt-4 text-base font-semibold text-slate-300">No transactions found</h2>
            <p className="mt-1 text-sm text-slate-600">Try changing your filters or add a new transaction.</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200"><X size={14} /> Clear filters</button>}
          </div>
        )}
      </section>

      <p className="mt-4 text-right text-xs text-slate-700">Showing {filteredTransactions.length} of {transactions.length} transactions</p>

      {formOpen && (
        <TransactionFormModal transaction={editing} onClose={() => { setFormOpen(false); setEditing(null) }} onSave={handleSave} />
      )}
      {deleting && (
        <DeleteTransactionDialog
          transaction={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => { onDelete(deleting.id); setDeleting(null) }}
        />
      )}
    </div>
  )
}

interface SummaryProps {
  label: string
  value: number
  icon: typeof ArrowDownLeft
  tone: 'emerald' | 'rose' | 'violet'
}

const summaryTones = {
  emerald: 'bg-emerald-400/10 text-emerald-300',
  rose: 'bg-rose-400/10 text-rose-300',
  violet: 'bg-violet-400/10 text-violet-300',
}

function Summary({ label, value, icon: Icon, tone }: SummaryProps) {
  return (
    <article className="card-surface flex items-center gap-4 p-4">
      <span className={`grid size-10 place-items-center rounded-xl ${summaryTones[tone]}`}><Icon size={17} /></span>
      <div className="min-w-0">
        <p className="text-xs text-slate-600">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold tracking-tight text-white">{formatNok(value)}</p>
      </div>
    </article>
  )
}
