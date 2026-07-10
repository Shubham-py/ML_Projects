import { Link } from 'react-router-dom'
import { roadmap } from '../data/roadmap'
import { getAlgorithmBySlug } from '../data/algorithms'
import { projects } from '../data/projects'
import { getInterviewTopicBySlug } from '../data/interview'
import { useProgress } from '../lib/progress'

export default function Roadmap() {
  const { algorithms: algoProgress, projects: projProgress } = useProgress()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">The 12-Week Interview-Ready Roadmap</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-3xl">
          A structured path from fundamentals to a full portfolio and interview-loop readiness. Follow it in order, or
          use it as a checklist against your own pace — every link jumps straight to the relevant deep-dive content.
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((week) => (
          <div key={week.week} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-bold text-[var(--color-accent)]">
                {week.week}
              </span>
              <h2 className="font-bold text-[var(--color-text-bright)]">{week.title}</h2>
            </div>

            <ul className="mt-3 ml-11 list-disc space-y-1 text-sm text-[var(--color-text-dim)]">
              {week.goals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>

            <div className="mt-3 ml-11 flex flex-wrap gap-1.5">
              {week.algorithmSlugs?.map((s) => {
                const a = getAlgorithmBySlug(s)
                if (!a) return null
                const done = algoProgress[s]
                return (
                  <Link
                    key={s}
                    to={`/algorithms/${s}`}
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${
                      done
                        ? 'border-[var(--color-accent2)] text-[var(--color-accent2)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {done ? '✓ ' : ''}
                    {a.name}
                  </Link>
                )
              })}
              {week.projectSlugs?.map((s) => {
                const p = projects.find((pr) => pr.slug === s)
                if (!p) return null
                const done = projProgress[s]
                return (
                  <Link
                    key={s}
                    to={`/projects/${s}`}
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${
                      done
                        ? 'border-[var(--color-accent2)] text-[var(--color-accent2)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {done ? '✓ ' : ''}
                    {p.title}
                  </Link>
                )
              })}
              {week.interviewSlugs?.map((s) => {
                const t = getInterviewTopicBySlug(s)
                if (!t) return null
                return (
                  <Link
                    key={s}
                    to={`/interview-prep/${s}`}
                    className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
                  >
                    {t.title}
                  </Link>
                )
              })}
              {week.labLinks?.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] px-2 py-1 text-xs font-medium text-[var(--color-accent)] hover:opacity-80"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
