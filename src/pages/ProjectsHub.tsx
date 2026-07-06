import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { DifficultyBadge, CompanyTierBadge, Tag } from '../components/Badge'
import { useProgress } from '../lib/progress'

const tiers = ['All', 'Startup', 'Mid-size', 'Big Tech']

export default function ProjectsHub() {
  const [tier, setTier] = useState('All')
  const { projects: progressMap } = useProgress()

  const filtered = useMemo(
    () => (tier === 'All' ? projects : projects.filter((p) => p.companyTier.includes(tier as any))),
    [tier],
  )

  const doneCount = Object.values(progressMap).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">ML Projects for Your Portfolio</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-3xl">
          End-to-end specs — dataset, approach, evaluation metrics, and the exact follow-up questions interviewers
          ask about each one. {doneCount}/{projects.length} marked complete.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              tier === t
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-[var(--color-text-bright)]">{p.title}</h3>
              {progressMap[p.slug] && (
                <span className="shrink-0 text-xs font-semibold text-[var(--color-accent2)]">✓ Done</span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <DifficultyBadge level={p.difficulty} />
              <Tag>{p.domain}</Tag>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.companyTier.map((t) => (
                <CompanyTierBadge key={t} tier={t} />
              ))}
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-dim)] leading-relaxed">{p.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
