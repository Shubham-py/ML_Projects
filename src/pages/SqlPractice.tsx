import { useMemo, useState } from 'react'
import { sqlExercises } from '../data/sqlExercises'
import { DifficultyBadge, Tag } from '../components/Badge'
import SqlPlayground from '../components/SqlPlayground'

const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const

export default function SqlPractice() {
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>('All')
  const [openSlug, setOpenSlug] = useState<string | null>(sqlExercises[0]?.slug ?? null)

  const filtered = useMemo(
    () => (difficulty === 'All' ? sqlExercises : sqlExercises.filter((e) => e.difficulty === difficulty)),
    [difficulty],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">SQL Practice Lab</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-3xl">
          Write and run real SQL against an in-browser SQLite engine — {sqlExercises.length} problems from basic
          joins to gaps-and-islands and cohort retention, exactly the patterns tested in DS/analytics interviews.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              difficulty === d
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((ex) => {
          const open = openSlug === ex.slug
          return (
            <div key={ex.slug} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <button
                onClick={() => setOpenSlug(open ? null : ex.slug)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <DifficultyBadge level={ex.difficulty} />
                    {ex.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <h3 className="mt-1.5 font-semibold text-[var(--color-text-bright)]">{ex.title}</h3>
                </div>
                <span className="shrink-0 text-[var(--color-accent)]">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="border-t border-[var(--color-border-soft)] p-4 space-y-4">
                  <p className="text-sm text-[var(--color-text)]">{ex.prompt}</p>
                  <SqlPlayground setupSql={ex.setupSql} starterQuery={ex.starterQuery} solutionQuery={ex.solutionQuery} />
                  <div className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-soft)] p-4 text-sm text-[var(--color-text-dim)]">
                    <strong className="text-[var(--color-text-bright)]">Why this works: </strong>
                    {ex.explanation}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
