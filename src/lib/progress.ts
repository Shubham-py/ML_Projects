import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ml-prep-progress-v1'

interface ProgressState {
  algorithms: Record<string, boolean>
  projects: Record<string, boolean>
  quizBest: Record<string, number>
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return { algorithms: {}, projects: {}, quizBest: {} }
}

function saveState(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

type Listener = () => void
const listeners = new Set<Listener>()
let state = loadState()

function setState(updater: (s: ProgressState) => ProgressState) {
  state = updater(state)
  saveState(state)
  listeners.forEach((l) => l())
}

export function useProgress() {
  const [, forceRender] = useState(0)

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const toggleAlgorithm = useCallback((slug: string) => {
    setState((s) => ({ ...s, algorithms: { ...s.algorithms, [slug]: !s.algorithms[slug] } }))
  }, [])

  const toggleProject = useCallback((slug: string) => {
    setState((s) => ({ ...s, projects: { ...s.projects, [slug]: !s.projects[slug] } }))
  }, [])

  const recordQuizScore = useCallback((category: string, score: number) => {
    setState((s) => ({
      ...s,
      quizBest: { ...s.quizBest, [category]: Math.max(s.quizBest[category] ?? 0, score) },
    }))
  }, [])

  return {
    algorithms: state.algorithms,
    projects: state.projects,
    quizBest: state.quizBest,
    toggleAlgorithm,
    toggleProject,
    recordQuizScore,
  }
}
