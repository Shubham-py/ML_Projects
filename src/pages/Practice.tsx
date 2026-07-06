import { useMemo, useState } from 'react'
import { quizBank, quizCategories } from '../data/quizBank'
import { useProgress } from '../lib/progress'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Practice() {
  const [category, setCategory] = useState('All')
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<typeof quizBank>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const { quizBest, recordQuizScore } = useProgress()

  const pool = useMemo(
    () => (category === 'All' ? quizBank : quizBank.filter((q) => q.category === category)),
    [category],
  )

  const startQuiz = () => {
    setQuestions(shuffle(pool))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setStarted(true)
  }

  const current = questions[index]

  const onSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === current.correctIndex) setScore((s) => s + 1)
  }

  const onNext = () => {
    if (index + 1 >= questions.length) {
      const pct = Math.round((score / questions.length) * 100)
      recordQuizScore(category, pct)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  if (!started || finished) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-bright)]">Practice Quiz</h1>
          <p className="mt-2 text-sm text-[var(--color-text-dim)]">
            {quizBank.length} questions across regression, classification, ensembles, unsupervised learning, deep
            learning, statistics, SQL, and ML system design. Every answer includes a full explanation.
          </p>
        </div>

        {finished && (
          <div className="rounded-xl border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] p-5">
            <p className="text-lg font-bold text-[var(--color-accent)]">
              You scored {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%) on{' '}
              {category}.
            </p>
          </div>
        )}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-[var(--color-text-bright)]">Choose a category</h2>
          <div className="flex flex-wrap gap-2">
            {['All', ...quizCategories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  category === c
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
                }`}
              >
                {c} {quizBest[c] !== undefined ? `· best ${quizBest[c]}%` : ''}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[#0b0d12] hover:opacity-90"
        >
          {finished ? 'Retake Quiz' : 'Start Quiz'} ({pool.length} questions)
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between text-sm text-[var(--color-text-dim)]">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>
          Score: {score}/{index + (selected !== null ? 1 : 0)}
        </span>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
        <span className="text-xs font-medium text-[var(--color-accent)]">{current.category}</span>
        <h2 className="mt-2 text-lg font-semibold text-[var(--color-text-bright)]">{current.question}</h2>

        <div className="mt-4 space-y-2">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.correctIndex
            const isSelected = i === selected
            let cls = 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
            if (selected !== null) {
              if (isCorrect) cls = 'border-[var(--color-accent2)] bg-[var(--color-accent2)]/10'
              else if (isSelected) cls = 'border-[var(--color-danger)] bg-[var(--color-danger)]/10'
            }
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`block w-full rounded-lg border p-3 text-left text-sm text-[var(--color-text)] transition-colors ${cls}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-soft)] p-4 text-sm text-[var(--color-text-dim)]">
            <strong className="text-[var(--color-text-bright)]">Explanation: </strong>
            {current.explanation}
          </div>
        )}

        {selected !== null && (
          <button
            onClick={onNext}
            className="mt-4 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#0b0d12] hover:opacity-90"
          >
            {index + 1 >= questions.length ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
