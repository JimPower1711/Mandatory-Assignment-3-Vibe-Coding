import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CirclePlus,
  Coins,
  Flag,
  Pencil,
  PiggyBank,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DeleteSavingsGoalDialog } from '../components/savings/DeleteSavingsGoalDialog'
import { SavingsGoalFormModal } from '../components/savings/SavingsGoalFormModal'
import { SavingsTransferModal } from '../components/savings/SavingsTransferModal'
import type {
  SavingsActivity,
  SavingsActivityType,
  SavingsGoal,
  SavingsGoalDetails,
  SavingsGoalDraft,
  SavingsTransferDraft,
} from '../types/finance'
import { formatDate, formatNok } from '../utils/finance'

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  activities: SavingsActivity[]
  availableBalance: number
  onAdd: (goal: SavingsGoalDraft) => void
  onUpdate: (id: string, details: SavingsGoalDetails) => void
  onDelete: (id: string) => void
  onTransfer: (goalId: string, transfer: SavingsTransferDraft) => void
}

interface TransferState {
  goal: SavingsGoal
  type: SavingsActivityType
}

export function SavingsGoals({ goals, activities, availableBalance, onAdd, onUpdate, onDelete, onTransfer }: SavingsGoalsProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [deleting, setDeleting] = useState<SavingsGoal | null>(null)
  const [transfer, setTransfer] = useState<TransferState | null>(null)

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const overallProgress = totalTarget ? (totalSaved / totalTarget) * 100 : 0
  const completedGoals = goals.filter((goal) => goal.currentAmount >= goal.targetAmount).length

  const recentActivities = useMemo(() => [...activities]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 8), [activities])

  const goalNames = useMemo(() => new Map(goals.map((goal) => [goal.id, goal.name])), [goals])

  const handleGoalSave = (draft: SavingsGoalDraft) => {
    if (editing) {
      const { currentAmount: _currentAmount, ...details } = draft
      onUpdate(editing.id, details)
    } else {
      onAdd(draft)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (goal: SavingsGoal) => {
    setEditing(goal)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Your next milestone</p>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">Savings goals</h1>
          <p className="mt-2 text-sm text-muted">Turn steady progress into plans you can see.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-midnight transition-colors duration-200 hover:bg-accent-hover">
          <CirclePlus size={17} /> New savings goal
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total saved" value={formatNok(totalSaved)} helper="Across all goals" icon={PiggyBank} tone="accent" />
        <SummaryCard label="Combined target" value={formatNok(totalTarget)} helper="Your planned total" icon={Target} tone="neutral" />
        <SummaryCard label="Overall progress" value={`${overallProgress.toFixed(1)}%`} helper="Toward every target" icon={TrendingUp} tone="accent" />
        <SummaryCard label="Completed goals" value={`${completedGoals} of ${goals.length}`} helper={completedGoals ? 'Milestones reached' : 'Keep building momentum'} icon={Flag} tone="muted" />
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={() => openEdit(goal)} onDelete={() => setDeleting(goal)} onTransfer={(type) => setTransfer({ goal, type })} />
        ))}
        <button type="button" onClick={openCreate} className="group min-h-[286px] rounded-[14px] border border-dashed border-border bg-card p-6 text-center transition-colors hover:border-accent/40">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent-muted"><CirclePlus size={20} /></span>
          <p className="mt-4 text-sm font-semibold text-muted group-hover:text-foreground">Create another goal</p>
          <p className="mx-auto mt-2 max-w-52 text-xs leading-5 text-muted">Give your next plan a target, timeline and a place to grow.</p>
        </button>
      </section>

      <section className="card-surface mt-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-5 sm:px-6">
          <div>
            <p className="section-kicker">Money movements</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Savings activity</h2>
          </div>
          <span className="rounded-lg bg-muted/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Latest {recentActivities.length}</span>
        </div>
        {recentActivities.length ? (
          <div>
            {recentActivities.map((activity) => {
              const contribution = activity.type === 'contribution'
              return (
                <div key={activity.id} className="flex items-center gap-3 border-t border-border px-5 py-3.5 transition-colors hover:bg-accent/5 sm:px-6">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${contribution ? 'bg-positive/10 text-positive' : 'bg-danger/10 text-danger'}`}>
                    {contribution ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{activity.note}</p>
                    <p className="mt-0.5 text-xs text-muted">{goalNames.get(activity.goalId) ?? 'Deleted goal'} · {formatDate(activity.date)}</p>
                  </div>
                  <p className={`text-sm font-semibold tabular-nums ${contribution ? 'text-positive' : 'text-danger'}`}>{contribution ? '+' : '−'}{formatNok(activity.amount)}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="border-t border-border px-6 py-14 text-center">
            <Coins className="mx-auto text-muted" size={24} />
            <p className="mt-3 text-sm text-muted">Your contributions and withdrawals will appear here.</p>
          </div>
        )}
      </section>

      {formOpen && <SavingsGoalFormModal goal={editing} availableBalance={availableBalance} onClose={() => { setFormOpen(false); setEditing(null) }} onSave={handleGoalSave} />}
      {transfer && (
        <SavingsTransferModal
          goal={transfer.goal}
          type={transfer.type}
          availableBalance={availableBalance}
          onClose={() => setTransfer(null)}
          onSave={(draft) => { onTransfer(transfer.goal.id, draft); setTransfer(null) }}
        />
      )}
      {deleting && (
        <DeleteSavingsGoalDialog
          goal={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => { onDelete(deleting.id); setDeleting(null) }}
        />
      )}
    </div>
  )
}

interface GoalCardProps {
  goal: SavingsGoal
  onEdit: () => void
  onDelete: () => void
  onTransfer: (type: SavingsActivityType) => void
}

function GoalCard({ goal, onEdit, onDelete, onTransfer }: GoalCardProps) {
  const progress = goal.targetAmount ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const complete = goal.currentAmount >= goal.targetAmount
  const deadline = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${goal.deadline}T12:00:00`))

  return (
    <article className="card-surface group p-5 transition-colors hover:border-accent/25 sm:p-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl" style={{ color: goal.color, backgroundColor: `${goal.color}16`, border: `1px solid ${goal.color}28` }}><PiggyBank size={20} /></span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onEdit} className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-muted/10 hover:text-foreground" aria-label={`Edit ${goal.name}`}><Pencil size={14} /></button>
            <button type="button" onClick={onDelete} className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger" aria-label={`Delete ${goal.name}`}><Trash2 size={14} /></button>
          </div>
        </div>

        <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{goal.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={12} /> Target {deadline}</p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.035em] text-foreground tabular-nums">{formatNok(goal.currentAmount)}</p>
            <p className="mt-1 text-xs text-muted">of {formatNok(goal.targetAmount)}</p>
          </div>
          <p className="text-sm font-semibold" style={{ color: goal.color }}>{progress.toFixed(0)}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/10">
          <div className="h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: goal.color }} />
        </div>
        <p className="mt-2 text-right text-[11px] text-muted">{complete ? 'Goal reached' : `${formatNok(remaining)} remaining`}</p>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
          <button type="button" onClick={() => onTransfer('contribution')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-xs font-semibold text-midnight transition-colors duration-200 hover:bg-accent-hover"><CirclePlus size={14} /> Add money</button>
          <button type="button" onClick={() => onTransfer('withdrawal')} disabled={goal.currentAmount === 0} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-danger/30 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"><ArrowUpRight size={14} /> Withdraw</button>
        </div>
      </div>
    </article>
  )
}

interface SummaryCardProps {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: 'accent' | 'neutral' | 'positive' | 'muted'
}

const tones = {
  accent: 'bg-accent/10 text-accent',
  neutral: 'bg-muted/10 text-muted',
  positive: 'bg-positive/10 text-positive',
  muted: 'bg-foreground/10 text-foreground',
}

function SummaryCard({ label, value, helper, icon: Icon, tone }: SummaryCardProps) {
  return (
    <article className="card-surface flex items-center gap-4 p-4">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon size={17} /></span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="mt-0.5 truncate text-[10px] text-muted">{helper}</p>
      </div>
    </article>
  )
}
