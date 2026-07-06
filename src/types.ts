export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface QA {
  q: string
  a: string
}

export interface Algorithm {
  slug: string
  name: string
  category: string
  difficulty: Difficulty
  tags: string[]
  summary: string
  companyRelevance: string
  content: string
  interviewQA: QA[]
}

export interface ProjectSpec {
  slug: string
  title: string
  difficulty: Difficulty
  domain: string
  companyTier: ('Startup' | 'Mid-size' | 'Big Tech')[]
  tags: string[]
  summary: string
  content: string
}

export interface InterviewTopic {
  slug: string
  title: string
  description: string
  content: string
}

export interface RoadmapWeek {
  week: number
  title: string
  goals: string[]
  algorithmSlugs?: string[]
  projectSlugs?: string[]
  interviewSlugs?: string[]
}

export interface QuizQuestion {
  id: string
  category: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}
