import { Link, Navigate, useParams } from 'react-router-dom'
import { getInterviewTopicBySlug } from '../data/interview'
import MarkdownContent from '../components/MarkdownContent'

export default function InterviewTopicPage() {
  const { slug } = useParams()
  const topic = slug ? getInterviewTopicBySlug(slug) : undefined

  if (!topic) return <Navigate to="/interview-prep" replace />

  return (
    <div className="space-y-6">
      <Link to="/interview-prep" className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
        &larr; All Interview Prep Topics
      </Link>
      <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">{topic.title}</h1>
      <p className="text-sm text-[var(--color-text-dim)]">{topic.description}</p>
      <MarkdownContent content={topic.content} />
    </div>
  )
}
