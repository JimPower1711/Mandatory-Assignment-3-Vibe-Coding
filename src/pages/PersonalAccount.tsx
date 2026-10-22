import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Database,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

interface PersonalAccountProps {
  onBack: () => void
}

const accountDetails = [
  { label: 'Full name', value: 'Nora Hansen', icon: UserRound },
  { label: 'Email', value: 'nora.hansen@example.com', icon: Mail },
  { label: 'Account type', value: 'Personal', icon: BadgeCheck },
  { label: 'Currency', value: 'Norwegian krone (NOK)', icon: Banknote },
]

export function PersonalAccount({ onBack }: PersonalAccountProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
      <header className="mb-7">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to overview
        </button>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Profile</p>
        <h1 className="text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">Personal account</h1>
        <p className="mt-2 text-sm text-muted">Your profile and account information.</p>
      </header>

      <section className="card-surface overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-accent-muted via-[#30264a] to-card" />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="grid size-[72px] shrink-0 place-items-center rounded-2xl border-4 border-card bg-accent text-xl font-bold text-midnight">NH</span>
              <div className="pb-1">
                <h2 className="text-xl font-semibold text-foreground">Nora Hansen</h2>
                <p className="mt-0.5 text-sm text-muted">Personal account</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-positive/20 bg-positive/10 px-3 py-1.5 text-xs font-semibold text-positive">
              <span className="size-1.5 rounded-full bg-positive" /> Active account
            </span>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="card-surface p-5 sm:p-6">
          <p className="section-kicker">Account details</p>
          <div className="mt-4 divide-y divide-border">
            {accountDetails.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 py-4 first:pt-1 last:pb-1">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-elevated text-accent-hover">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted">{label}</p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5 sm:p-6">
          <p className="section-kicker">Data & privacy</p>
          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <Database size={19} className="mt-0.5 shrink-0 text-accent-hover" />
              <div>
                <p className="text-sm font-medium text-foreground">Stored on this device</p>
                <p className="mt-1 text-xs leading-5 text-muted">Your finance data stays in this browser using local storage.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck size={19} className="mt-0.5 shrink-0 text-positive" />
              <div>
                <p className="text-sm font-medium text-foreground">No bank connection</p>
                <p className="mt-1 text-xs leading-5 text-muted">This demo does not connect to a bank or process real payments.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
