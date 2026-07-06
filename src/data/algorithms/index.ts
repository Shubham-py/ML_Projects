import type { Algorithm } from '../../types'
import { regressionAlgorithms } from './regression'
import { classificationAlgorithms } from './classification'
import { ensembleAlgorithms } from './ensemble'
import { unsupervisedAlgorithms } from './unsupervised'
import { deepLearningAlgorithms } from './deeplearning'

export const algorithms: Algorithm[] = [
  ...regressionAlgorithms,
  ...classificationAlgorithms,
  ...ensembleAlgorithms,
  ...unsupervisedAlgorithms,
  ...deepLearningAlgorithms,
]

export const algorithmCategories = Array.from(new Set(algorithms.map((a) => a.category)))

export function getAlgorithmBySlug(slug: string): Algorithm | undefined {
  return algorithms.find((a) => a.slug === slug)
}
