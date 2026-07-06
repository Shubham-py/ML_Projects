import type { InterviewTopic } from '../../types'
import { quantTopics } from './quant'
import { systemsAndCareerTopics } from './systemsAndCareer'

export const interviewTopics: InterviewTopic[] = [...quantTopics, ...systemsAndCareerTopics]

export function getInterviewTopicBySlug(slug: string): InterviewTopic | undefined {
  return interviewTopics.find((t) => t.slug === slug)
}
