import { DRUM_VOICES, type DrumVoice } from './musicTheory'
import { emptyDrumPattern, emptyMelodyPattern, STEPS_PER_PATTERN, type DrumPattern } from './audioEngine'

export interface Pattern {
  id: string
  name: string
  color: string
  drum: DrumPattern
  bass: (string | null)[]
  lead: (string | null)[]
}

function drumFromSteps(hits: Partial<Record<DrumVoice, number[]>>): DrumPattern {
  const pattern = emptyDrumPattern()
  for (const voice of DRUM_VOICES) {
    const steps = hits[voice] ?? []
    for (const step of steps) pattern[voice][step] = true
  }
  return pattern
}

function melodyFromSteps(notes: Partial<Record<number, string>>): (string | null)[] {
  const pattern = emptyMelodyPattern()
  for (const [step, note] of Object.entries(notes)) pattern[Number(step)] = note ?? null
  return pattern
}

export function blankPattern(id: string, name: string, color: string): Pattern {
  return {
    id,
    name,
    color,
    drum: emptyDrumPattern(),
    bass: emptyMelodyPattern(),
    lead: emptyMelodyPattern(),
  }
}

/** A ready-made 4-section house/EDM starter song so there's something to play, tweak, and learn from immediately. */
export function starterSong(): Pattern[] {
  return [
    {
      id: 'intro',
      name: 'Intro',
      color: 'var(--color-neon-cyan)',
      drum: drumFromSteps({
        kick: [0, 4, 8, 12],
        closedHat: [2, 6, 10, 14],
      }),
      bass: emptyMelodyPattern(),
      lead: emptyMelodyPattern(),
    },
    {
      id: 'build',
      name: 'Build-Up',
      color: 'var(--color-neon-yellow)',
      drum: drumFromSteps({
        kick: [0, 4, 8, 12],
        closedHat: [0, 2, 4, 6, 8, 10, 12, 14],
        clap: [4, 12],
        openHat: [14],
      }),
      bass: melodyFromSteps({ 0: 'A1', 4: 'A1', 8: 'C2', 12: 'A1' }),
      lead: emptyMelodyPattern(),
    },
    {
      id: 'drop',
      name: 'Drop',
      color: 'var(--color-neon-pink)',
      drum: drumFromSteps({
        kick: [0, 4, 8, 12],
        closedHat: [2, 6, 10, 14],
        clap: [4, 12],
        tom: [15],
      }),
      bass: melodyFromSteps({ 0: 'A1', 2: 'A1', 4: 'C2', 6: 'A1', 8: 'A1', 10: 'A1', 12: 'G1', 14: 'A1' }),
      lead: melodyFromSteps({ 0: 'A3', 4: 'C4', 8: 'E4', 12: 'C4' }),
    },
    {
      id: 'break',
      name: 'Breakdown',
      color: 'var(--color-neon-purple)',
      drum: drumFromSteps({
        closedHat: [0, 4, 8, 12],
      }),
      bass: emptyMelodyPattern(),
      lead: melodyFromSteps({ 0: 'A3', 6: 'E4', 8: 'C4', 14: 'A3' }),
    },
  ]
}

export interface Project {
  name: string
  bpm: number
  patterns: Pattern[]
  arrangement: string[]
  barsPerSection: number
  sidechainAmount: number
  sidechainEnabled: boolean
  reverbWet: number
  delayWet: number
}

export function starterProject(): Project {
  return {
    name: 'My First Drop',
    bpm: 126,
    patterns: starterSong(),
    arrangement: ['intro', 'build', 'drop', 'drop', 'break', 'build', 'drop'],
    barsPerSection: 2,
    sidechainAmount: 0.6,
    sidechainEnabled: true,
    reverbWet: 0.15,
    delayWet: 0.1,
  }
}

export { STEPS_PER_PATTERN }
