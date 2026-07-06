import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { algorithms, algorithmCategories } from '../data/algorithms'
import { DifficultyBadge, Tag } from '../components/Badge'
import { useProgress } from '../lib/progress'

export default function AlgorithmsHub() {
  const [category, setCategory] = useState<string>('All')
  const { algorithms: progressMap } = useProgress()

  const filtered = useMemo(
    () => (category === 'All' ? algorithms : algorithms.filter((a) => a.category === category)),
    [category],
  )

  const doneCount = Object.values(progressMap).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">ML Algorithms — Full Depth</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-3xl">
          Every entry derives the math, states the assumptions, covers complexity and pitfalls, includes real
          interview Q&amp;A, and links to a from-scratch Code Lab exercise. {doneCount}/{algorithms.length} marked
          complete.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...algorithmCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === c
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((algo) => (
          <Link
            key={algo.slug}
            to={`/algorithms/${algo.slug}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent)] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-[var(--color-text-bright)]">{algo.name}</h3>
              {progressMap[algo.slug] && (
                <span className="shrink-0 text-xs font-semibold text-[var(--color-accent2)]">✓ Done</span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <DifficultyBadge level={algo.difficulty} />
              <Tag>{algo.category}</Tag>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-dim)] leading-relaxed">{algo.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
