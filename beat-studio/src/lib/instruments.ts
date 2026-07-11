import * as Tone from 'tone'

export type InstrumentType = 'analog' | 'fm' | 'am' | 'duo' | 'pluck'

export const INSTRUMENT_TYPES: InstrumentType[] = ['analog', 'fm', 'am', 'duo', 'pluck']

export const INSTRUMENT_LABELS: Record<InstrumentType, string> = {
  analog: 'Analog',
  fm: 'FM',
  am: 'AM',
  duo: 'Duo',
  pluck: 'Pluck',
}

export const INSTRUMENT_DESCRIPTIONS: Record<InstrumentType, string> = {
  analog: 'Classic subtractive synthesis — an oscillator shaped by a filter. The workhorse of EDM basses and leads.',
  fm: 'Frequency modulation — one oscillator modulates another\'s pitch at audio rate. Metallic, bell-like, digital tones (think classic DX7 electric pianos and basses).',
  am: 'Amplitude modulation — one oscillator modulates another\'s volume. Buzzy, tremolo-rich, slightly aggressive textures.',
  duo: 'Two detuned voices with vibrato — thick, wide, chorus-like basses and leads for free.',
  pluck: 'Karplus-Strong physical modeling — simulates a plucked string. Guitar/harp-like, percussive, naturally decaying.',
}

export type MonoVoice = Tone.MonoSynth | Tone.FMSynth | Tone.AMSynth | Tone.DuoSynth | Tone.PluckSynth

export interface InstrumentSettings {
  type: InstrumentType
  params: Record<string, number | string>
}

export function defaultParamsFor(type: InstrumentType): Record<string, number | string> {
  switch (type) {
    case 'analog':
      return { waveform: 'sawtooth' }
    case 'fm':
      return { waveform: 'sine', harmonicity: 3, modulationIndex: 10 }
    case 'am':
      return { waveform: 'sine', harmonicity: 2.5 }
    case 'duo':
      return { harmonicity: 1.5, vibratoAmount: 0.3, vibratoRate: 5 }
    case 'pluck':
      return { attackNoise: 1, dampening: 4000, resonance: 0.9 }
  }
}

export function defaultInstrument(type: InstrumentType = 'analog'): InstrumentSettings {
  return { type, params: defaultParamsFor(type) }
}

export function createMonoVoice(type: InstrumentType): MonoVoice {
  switch (type) {
    case 'analog':
      return new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.3 },
        filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3, baseFrequency: 200, octaves: 3 },
      })
    case 'fm':
      return new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 },
      })
    case 'am':
      return new Tone.AMSynth({
        harmonicity: 2.5,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 },
      })
    case 'duo':
      return new Tone.DuoSynth({
        harmonicity: 1.5,
        vibratoAmount: 0.3,
        vibratoRate: 5,
      })
    case 'pluck':
      return new Tone.PluckSynth({ attackNoise: 1, dampening: 4000, resonance: 0.9 })
  }
}

/** Keys is polyphonic — PolySynth can wrap any Monophonic-derived voice, but not PluckSynth, so 'pluck' falls back to 'analog'. */
export function createPolyVoice(type: InstrumentType): Tone.PolySynth<any> {
  switch (type) {
    case 'fm':
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.6 },
      })
    case 'am':
      return new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 2.5,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.6 },
      })
    case 'duo':
      return new Tone.PolySynth(Tone.DuoSynth, {
        harmonicity: 1.5,
        vibratoAmount: 0.3,
        vibratoRate: 5,
      })
    case 'analog':
    case 'pluck':
    default:
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.25, sustain: 0.35, release: 0.9 },
      })
  }
}

/** Translates the flat UI param object into the nested `.set()` shape each Tone.js instrument actually expects. */
export function applyParams(voice: MonoVoice | Tone.PolySynth<any>, type: InstrumentType, params: Record<string, number | string>) {
  switch (type) {
    case 'analog':
      voice.set({ oscillator: { type: params.waveform as Tone.ToneOscillatorType } } as never)
      break
    case 'fm':
      voice.set({
        oscillator: { type: params.waveform as Tone.ToneOscillatorType },
        harmonicity: params.harmonicity as number,
        modulationIndex: params.modulationIndex as number,
      } as never)
      break
    case 'am':
      voice.set({
        oscillator: { type: params.waveform as Tone.ToneOscillatorType },
        harmonicity: params.harmonicity as number,
      } as never)
      break
    case 'duo':
      voice.set({
        harmonicity: params.harmonicity as number,
        vibratoAmount: params.vibratoAmount as number,
        vibratoRate: params.vibratoRate as number,
      } as never)
      break
    case 'pluck':
      voice.set({
        attackNoise: params.attackNoise as number,
        dampening: params.dampening as number,
        resonance: params.resonance as number,
      } as never)
      break
  }
}
