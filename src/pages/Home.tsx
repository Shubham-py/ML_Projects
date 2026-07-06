import { Link } from 'react-router-dom'
import { algorithms } from '../data/algorithms'
import { projects } from '../data/projects'
import { interviewTopics } from '../data/interview'
import { quizBank } from '../data/quizBank'

const stats = [
  { label: 'Algorithms, in full depth', value: algorithms.length },
  { label: 'End-to-end portfolio projects', value: projects.length },
  { label: 'Interview deep-dive topics', value: interviewTopics.length },
  { label: 'Practice quiz questions', value: quizBank.length },
]

const pillars = [
  {
    title: 'Algorithms — Math, Not Just Vibes',
    body: 'Every algorithm page derives the math (not just states it), covers assumptions, complexity, pitfalls, and a from-scratch Python implementation you write yourself in the Code Lab.',
    to: '/algorithms',
    cta: 'Study the algorithms',
  },
  {
    title: 'Projects Recruiters Actually Ask About',
    body: 'Churn, fraud, credit risk, recommenders, forecasting, A/B testing, NLP, computer vision — each with dataset pointers, a step-by-step approach, and the exact follow-up questions interviewers ask.',
    to: '/projects',
    cta: 'Build your portfolio',
  },
  {
    title: 'Interview Prep Beyond Just ML',
    body: 'Statistics, SQL, Python/pandas, ML system design, case studies, and India-specific behavioral + company-tier (startup/mid/big tech) prep — the parts most candidates skip and lose offers over.',
    to: '/interview-prep',
    cta: 'Prep the full loop',
  },
  {
    title: 'Practice Until It Sticks',
    body: 'A quiz bank across every category with explanations, plus a 12-week structured roadmap tying algorithms, projects, and interview topics into one plan.',
    to: '/practice',
    cta: 'Start practicing',
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-5 pt-6">
        <span className="inline-block rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
          For Data Scientist roles across India — startups to big tech
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
          Get interview-ready with full-depth ML,
          <br className="hidden md:block" /> not another skimmed cheat sheet.
        </h1>
        <p className="mx-auto max-w-2xl text-[var(--color-text-dim)] text-base md:text-lg">
          Derivations, from-scratch code, real portfolio projects, and the statistics/SQL/system-design/behavioral
          prep that actually decides offers — structured into a 12-week plan you can start today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/roadmap"
            className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0b0d12] hover:opacity-90 transition-opacity"
          >
            Start the 12-Week Roadmap
          </Link>
          <Link
            to="/algorithms"
            className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text-bright)] hover:border-[var(--color-accent)] transition-colors"
          >
            Browse Algorithms
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 text-center"
          >
            <div className="text-3xl font-extrabold text-[var(--color-accent)]">{s.value}</div>
            <div className="mt-1 text-xs text-[var(--color-text-dim)]">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        {pillars.map((p) => (
          <Link
            key={p.title}
            to={p.to}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 hover:border-[var(--color-accent)] transition-colors"
          >
            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">{p.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">{p.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)]">
              {p.cta}
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-8">
        <h2 className="text-xl font-bold text-[var(--color-text-bright)]">Why "full depth" actually matters here</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-dim)]">
          Most prep resources give you a one-paragraph summary of Random Forest and call it done — that gets you
          eliminated the moment an interviewer asks "why does decorrelating trees reduce variance, exactly?" This
          site is built the opposite way: every algorithm page derives the math from first principles, every project
          spec includes the follow-up questions interviewers actually ask, and every interview-prep topic covers the
          reasoning, not just the term. Depth is the differentiator between a candidate who sounds like they read a
          blog post and one who sounds like they could join the team tomorrow.
        </p>
      </section>
    </div>
  )
}
