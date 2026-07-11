export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export type NoteName = (typeof NOTE_NAMES)[number]

export interface ScaleDef {
  name: string
  intervals: number[]
  vibe: string
}

export const SCALES: Record<string, ScaleDef> = {
  minor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], vibe: 'The default EDM/house/techno scale — moody, versatile, works for basslines and leads alike.' },
  major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11], vibe: 'Bright, uplifting — common in progressive house and trance melodies.' },
  minorPentatonic: { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10], vibe: '5 notes, no way to hit a "wrong" note — great for quick basslines and riffs.' },
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], vibe: 'Minor but with a brighter 6th — a deep-house and funk staple.' },
  phrygian: { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], vibe: 'Dark, tense, exotic — common in dubstep and dark techno basslines.' },
  harmonicMinor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], vibe: 'Dramatic, cinematic — great for trance and big-room leads.' },
}

export function noteNameToMidi(note: NoteName, octave: number): number {
  return NOTE_NAMES.indexOf(note) + (octave + 1) * 12
}

export function midiToNoteString(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const name = NOTE_NAMES[((midi % 12) + 12) % 12]
  return `${name}${octave}`
}

/** Generate the MIDI note numbers for a scale across a given octave range, rooted at `rootMidi`. */
export function scaleNotes(rootMidi: number, scaleKey: keyof typeof SCALES, octaves = 2): number[] {
  const scale = SCALES[scaleKey]
  const notes: number[] = []
  for (let o = 0; o < octaves; o++) {
    for (const interval of scale.intervals) {
      notes.push(rootMidi + interval + o * 12)
    }
  }
  return notes
}

export const DRUM_VOICES = ['kick', 'snare', 'closedHat', 'openHat', 'clap', 'tom'] as const
export type DrumVoice = (typeof DRUM_VOICES)[number]

export const DRUM_VOICE_LABELS: Record<DrumVoice, string> = {
  kick: 'Kick',
  snare: 'Snare',
  closedHat: 'Closed Hat',
  openHat: 'Open Hat',
  clap: 'Clap',
  tom: 'Tom',
}

/** Computer-keyboard-to-piano mapping, like a classic tracker/DAW "keyboard as piano" layout. */
export const KEYBOARD_NOTE_MAP: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11,
  k: 12, o: 13, l: 14, p: 15, ';': 16,
}
