import { ArrowLeft, Construction, Sparkles } from 'lucide-react'
const content = {
  title: 'Analytics',
  description: 'Explore richer trends and category insights after the core flows are complete.',
  phase: 'Future',
}

export function PhasePlaceholder({ onBack }: { onBack: () => void }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-16 lg:min-h-screen">
      <div className="w-full max-w-lg rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/15">
          <Construction size={23} />
        </span>
        <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400"><Sparkles size={12} /> {content.phase}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{content.title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">{content.description} This section is intentionally held for a future development phase.</p>
        <button type="button" onClick={onBack} className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
          <ArrowLeft size={16} /> Back to overview
        </button>
      </div>
    </div>
  )
}
