import { Link } from 'react-router-dom'
import { interviewTopics } from '../data/interview'

export default function InterviewHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">Interview Prep Beyond ML</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-3xl">
          The statistics, SQL, system design, case-study, and India-specific behavioral/negotiation prep that
          decides offers as much as (or more than) knowing the algorithms.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {interviewTopics.map((t) => (
          <Link
            key={t.slug}
            to={`/interview-prep/${t.slug}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent)] transition-colors"
          >
            <h3 className="font-bold text-[var(--color-text-bright)]">{t.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
