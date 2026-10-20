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
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Money activity</p>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">Transactions</h1>
          <p className="mt-2 text-sm text-muted">Keep every krone categorized and accounted for.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-midnight transition-colors duration-200 hover:bg-accent-hover">
          <CirclePlus size={17} /> Add transaction
        </button>
      </header>

      <section className="mb-4 grid gap-3 sm:grid-cols-3">
        <Summary label="Filtered income" value={totals.income} icon={ArrowDownLeft} tone="positive" />
        <Summary label="Filtered expenses" value={totals.expenses} icon={ArrowUpRight} tone="negative" />
        <Summary label="Net cash flow" value={totals.income - totals.expenses} icon={WalletCards} tone="neutral" />
      </section>

      <section className="card-surface overflow-hidden">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={17} />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" className="form-control pl-10" aria-label="Search transactions" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex rounded-xl bg-midnight/55 p-1" aria-label="Filter by transaction type">
                {(['all', 'income', 'expense'] as TypeFilter[]).map((type) => (
                  <button key={type} type="button" onClick={() => setType(type)} className={`flex-1 rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition-colors sm:flex-none ${typeFilter === type ? 'bg-accent-muted text-accent ring-1 ring-accent/25' : 'text-muted hover:text-foreground'}`}>{type}</button>
                ))}
              </div>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="form-control min-w-44 pl-10 text-xs font-semibold" aria-label="Filter by category">
                  <option value="all">All categories</option>
                  {allCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(220px,1.4fr)_minmax(130px,0.7fr)_100px_130px_84px] gap-4 border-b border-border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:grid">
          <span>Description</span><span>Category</span><span>Date</span><span className="text-right">Amount</span><span />
        </div>

        {filteredTransactions.length ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="group flex items-center gap-3 border-b border-border px-4 py-4 last:border-b-0 hover:bg-accent/5 sm:px-5 md:grid md:grid-cols-[minmax(220px,1.4fr)_minmax(130px,0.7fr)_100px_130px_84px] md:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${transaction.type === 'income' ? 'bg-positive/10 text-positive' : 'bg-danger/10 text-danger'}`}>
                    {transaction.type === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{transaction.description}</p>
                    <p className="mt-0.5 text-xs capitalize text-muted md:hidden">{transaction.category} · {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <span className="hidden text-sm text-muted md:block">{transaction.category}</span>
                <span className="hidden text-sm text-muted md:block">{formatDate(transaction.date)}</span>
                <p className={`ml-auto text-right text-sm font-semibold tabular-nums md:ml-0 ${transaction.type === 'income' ? 'text-positive' : 'text-danger'}`}>
                  {transaction.type === 'income' ? '+' : '−'}{formatNok(transaction.amount)}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <button type="button" onClick={() => openEdit(transaction)} className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-muted/10 hover:text-foreground" aria-label={`Edit ${transaction.description}`}><Pencil size={14} /></button>
                  <button type="button" onClick={() => setDeleting(transaction)} className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger" aria-label={`Delete ${transaction.description}`}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted/10 text-muted"><Search size={20} /></span>
            <h2 className="mt-4 text-base font-semibold text-foreground">No transactions found</h2>
            <p className="mt-1 text-sm text-muted">Try changing your filters or add a new transaction.</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-opacity hover:opacity-75"><X size={14} /> Clear filters</button>}
          </div>
        )}
      </section>

      <p className="mt-4 text-right text-xs text-muted">Showing {filteredTransactions.length} of {transactions.length} transactions</p>

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
  tone: 'positive' | 'negative' | 'neutral'
}

const summaryTones = {
  positive: 'bg-positive/10 text-positive',
  negative: 'bg-danger/10 text-danger',
  neutral: 'bg-muted/10 text-muted',
}

const summaryValueTones = {
  positive: 'text-positive',
  negative: 'text-danger',
  neutral: 'text-foreground',
}

function Summary({ label, value, icon: Icon, tone }: SummaryProps) {
  return (
    <article className="card-surface flex items-center gap-4 p-4">
      <span className={`grid size-10 place-items-center rounded-xl ${summaryTones[tone]}`}><Icon size={17} /></span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className={`mt-1 truncate text-lg font-semibold tracking-tight tabular-nums ${summaryValueTones[tone]}`}>{formatNok(value)}</p>
      </div>
    </article>
  )
}
