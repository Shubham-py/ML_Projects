import { Link, Navigate, useParams } from 'react-router-dom'
import { lessons } from '../data/lessons'
import LessonContent from '../components/LessonContent'

export default function LessonDetail() {
  const { slug } = useParams()
  const lesson = lessons.find((l) => l.slug === slug)
  if (!lesson) return <Navigate to="/lessons" replace />

  const index = lessons.findIndex((l) => l.slug === slug)
  const prev = lessons[index - 1]
  const next = lessons[index + 1]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/lessons" className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-purple)]">
        &larr; All Lessons
      </Link>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-neon-cyan)]">{lesson.category}</span>
        <h1 className="mt-1 text-2xl font-extrabold text-[var(--color-text-bright)]">{lesson.title}</h1>
      </div>
      <LessonContent content={lesson.content} />
      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        {prev ? (
          <Link to={`/lessons/${prev.slug}`} className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-purple)]">
            &larr; {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/lessons/${next.slug}`} className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-neon-purple)]">
            {next.title} &rarr;
          </Link>
        ) : (
          <Link to="/studio" className="text-sm font-semibold text-[var(--color-neon-cyan)]">
            Open the Studio &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}
