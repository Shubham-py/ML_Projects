import type { ReactNode } from 'react'

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  Easy: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  Intermediate: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Medium: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  Advanced: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
  Hard: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
}

export function DifficultyBadge({ level }: { level: string }) {
  const cls = difficultyColors[level] ?? 'bg-slate-400/10 text-slate-300 border-slate-400/30'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {level}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-0.5 text-xs text-[var(--color-text-dim)]">
      {children}
    </span>
  )
}

export function CompanyTierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Startup: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    'Mid-size': 'bg-violet-400/10 text-violet-300 border-violet-400/30',
    'Big Tech': 'bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30',
  }
  const cls = colors[tier] ?? 'bg-slate-400/10 text-slate-300 border-slate-400/30'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {tier}
    </span>
  )
}
