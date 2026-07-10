import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getAlgorithmBySlug } from '../data/algorithms'
import { getExerciseForAlgorithm } from '../data/codeExercises'
import MarkdownContent from '../components/MarkdownContent'
import { DifficultyBadge, Tag } from '../components/Badge'
import { useProgress } from '../lib/progress'
import PythonPlayground from '../components/PythonPlayground'

type Tab = 'theory' | 'code' | 'qa'

export default function AlgorithmDetail() {
  const { slug } = useParams()
  const algo = slug ? getAlgorithmBySlug(slug) : undefined
  const exercise = slug ? getExerciseForAlgorithm(slug) : undefined
  const [tab, setTab] = useState<Tab>('theory')
  const [openQA, setOpenQA] = useState<number | null>(0)
  const { algorithms: progressMap, toggleAlgorithm } = useProgress()

  if (!algo) return <Navigate to="/algorithms" replace />

  const done = Boolean(progressMap[algo.slug])

  return (
    <div className="space-y-6">
      <Link to="/algorithms" className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
        &larr; All Algorithms
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">{algo.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <DifficultyBadge level={algo.difficulty} />
            <Tag>{algo.category}</Tag>
            {algo.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        <button
          onClick={() => toggleAlgorithm(algo.slug)}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
            done
              ? 'border-[var(--color-accent2)] bg-[var(--color-accent2)]/10 text-[var(--color-accent2)]'
              : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
          }`}
        >
          {done ? '✓ Marked Complete' : 'Mark as Complete'}
        </button>
      </div>

      <div className="rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] p-4 text-sm text-[var(--color-text)]">
        <strong className="text-[var(--color-accent)]">Where this comes up: </strong>
        {algo.companyRelevance}
      </div>

      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {(
          [
            ['theory', 'Full Theory & Math'],
            ['code', 'Code Lab'],
            ['qa', `Interview Q&A (${algo.interviewQA.length})`],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === key
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'theory' && <MarkdownContent content={algo.content} />}

      {tab === 'code' && (
        <div className="space-y-4">
          {exercise ? (
            <>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
                <h3 className="font-semibold text-[var(--color-text-bright)]">Exercise</h3>
                <p className="mt-1 text-sm text-[var(--color-text-dim)]">{exercise.prompt}</p>
              </div>
              <PythonPlayground starterCode={exercise.starterCode} solutionCode={exercise.solutionCode} />
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-dim)]">No code exercise yet for this algorithm.</p>
          )}
        </div>
      )}

      {tab === 'qa' && (
        <div className="space-y-3">
          {algo.interviewQA.map((qa, i) => (
            <div key={i} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <button
                onClick={() => setOpenQA(openQA === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="font-medium text-[var(--color-text-bright)] text-sm">{qa.q}</span>
                <span className="shrink-0 text-[var(--color-accent)]">{openQA === i ? '−' : '+'}</span>
              </button>
              {openQA === i && (
                <div className="border-t border-[var(--color-border-soft)] p-4 text-sm leading-relaxed text-[var(--color-text-dim)]">
                  {qa.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
