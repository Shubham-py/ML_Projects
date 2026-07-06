import { Link, Navigate, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import MarkdownContent from '../components/MarkdownContent'
import { DifficultyBadge, CompanyTierBadge, Tag } from '../components/Badge'
import { useProgress } from '../lib/progress'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  const { projects: progressMap, toggleProject } = useProgress()

  if (!project) return <Navigate to="/projects" replace />

  const done = Boolean(progressMap[project.slug])

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
        &larr; All Projects
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">{project.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <DifficultyBadge level={project.difficulty} />
            <Tag>{project.domain}</Tag>
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.companyTier.map((t) => (
              <CompanyTierBadge key={t} tier={t} />
            ))}
          </div>
        </div>
        <button
          onClick={() => toggleProject(project.slug)}
          className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
            done
              ? 'border-[var(--color-accent2)] bg-[var(--color-accent2)]/10 text-[var(--color-accent2)]'
              : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
          }`}
        >
          {done ? '✓ Marked Complete' : 'Mark as Complete'}
        </button>
      </div>

      <MarkdownContent content={project.content} />
    </div>
  )
}
