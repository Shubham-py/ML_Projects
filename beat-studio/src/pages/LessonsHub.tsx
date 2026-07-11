import { Link } from 'react-router-dom'
import { lessons, lessonCategories } from '../data/lessons'

export default function LessonsHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">Lessons</h1>
        <p className="mt-2 text-sm text-[var(--color-text-dim)] max-w-2xl">
          Everything you need to go from "never made music before" to building a full EDM section — sound design,
          music theory, rhythm, arrangement, and production technique, each tied directly to what you can try right
          now in the Studio.
        </p>
      </div>

      {lessonCategories.map((category) => (
        <div key={category}>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-neon-cyan)]">{category}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lessons
              .filter((l) => l.category === category)
              .map((lesson) => (
                <Link
                  key={lesson.slug}
                  to={`/lessons/${lesson.slug}`}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-neon-purple)] transition-colors"
                >
                  <h3 className="font-bold text-[var(--color-text-bright)]">{lesson.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">{lesson.description}</p>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
