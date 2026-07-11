import * as Tone from 'tone'
import { DRUM_VOICES, type DrumVoice } from './musicTheory'

export const STEPS_PER_PATTERN = 16

export interface DrumPattern extends Record<DrumVoice, boolean[]> {}

export function emptyDrumPattern(): DrumPattern {
  const pattern = {} as DrumPattern
  for (const voice of DRUM_VOICES) pattern[voice] = new Array(STEPS_PER_PATTERN).fill(false)
  return pattern
}

export function emptyMelodyPattern(): (string | null)[] {
  return new Array(STEPS_PER_PATTERN).fill(null)
}

type StepListener = (step: number) => void
type SectionListener = (sectionIndex: number) => void
export type BasicOscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'

class AudioEngine {
  private ready = false

  private masterGain = new Tone.Gain(0.85)
  private duck = new Tone.Gain(1)
  private masterFilter = new Tone.Filter(20000, 'lowpass')
  private delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.25, wet: 0 })
  private reverb = new Tone.Reverb({ decay: 2.5, wet: 0 })
  private limiter = new Tone.Limiter(-1)
  private recorder = new Tone.Recorder()

  private keysSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.25, sustain: 0.35, release: 0.9 },
  })

  private bassSynth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    filter: { Q: 2, type: 'lowpass', rolloff: -24 },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.3 },
    filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3, baseFrequency: 80, octaves: 3 },
  })

  private leadSynth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    filter: { Q: 1, type: 'lowpass', rolloff: -12 },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.6 },
    filterEnvelope: { attack: 0.02, decay: 0.4, sustain: 0.5, release: 0.6, baseFrequency: 400, octaves: 4 },
  })

  private wobbleLfo = new Tone.LFO({ frequency: '8n', min: 200, max: 3000 })
  private wobbleEnabled = false

  private kick = new Tone.MembraneSynth({ pitchDecay: 0.045, octaves: 6, envelope: { attack: 0.001, decay: 0.35, sustain: 0 } })
  private snareNoise = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 } })
  private snareFilter = new Tone.Filter(1800, 'bandpass')
  private hatClosed = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.045, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.2 })
  private hatOpen = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.3, release: 0.05 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.2 })
  private clapNoise = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.12, sustain: 0 } })
  private tom = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4, envelope: { attack: 0.001, decay: 0.3, sustain: 0 } })

  private drumPattern: DrumPattern = emptyDrumPattern()
  private bassPattern: (string | null)[] = emptyMelodyPattern()
  private leadPattern: (string | null)[] = emptyMelodyPattern()

  private currentStep = 0
  private loopId: number | null = null
  private stepListeners = new Set<StepListener>()
  private sectionListeners = new Set<SectionListener>()

  private arrangement: string[] = []
  private arrangementIndex = 0
  private barsPerSection = 1 // how many 16-step loops before advancing to the next arrangement section
  private barCounter = 0
  private onLoadSection: ((sectionId: string) => void) | null = null

  private sidechainAmount = 0.6
  private sidechainEnabled = true

  constructor() {
    this.masterGain.chain(this.duck, this.masterFilter, this.delay, this.reverb, this.limiter, Tone.getDestination())
    this.limiter.connect(this.recorder)

    this.keysSynth.connect(this.masterGain)
    this.bassSynth.connect(this.masterGain)
    this.leadSynth.connect(this.masterGain)
    this.kick.connect(this.masterGain)
    this.snareNoise.chain(this.snareFilter, this.masterGain)
    this.hatClosed.connect(this.masterGain)
    this.hatOpen.connect(this.masterGain)
    this.clapNoise.connect(this.masterGain)
    this.tom.connect(this.masterGain)

    this.wobbleLfo.connect(this.leadSynth.filter.frequency)

    Tone.getTransport().bpm.value = 126
  }

  async start() {
    if (this.ready) return
    await Tone.start()
    this.ready = true
  }

  get isReady() {
    return this.ready
  }

  // ---------- Transport ----------

  setBpm(bpm: number) {
    Tone.getTransport().bpm.rampTo(bpm, 0.1)
  }

  getBpm() {
    return Tone.getTransport().bpm.value
  }

  onStep(listener: StepListener) {
    this.stepListeners.add(listener)
    return () => this.stepListeners.delete(listener)
  }

  onSectionChange(listener: SectionListener) {
    this.sectionListeners.add(listener)
    return () => this.sectionListeners.delete(listener)
  }

  setArrangement(sectionIds: string[], barsPerSection: number, loadSection: (id: string) => void) {
    this.arrangement = sectionIds
    this.barsPerSection = Math.max(1, barsPerSection)
    this.onLoadSection = loadSection
  }

  play() {
    this.currentStep = 0
    this.barCounter = 0
    this.arrangementIndex = 0
    if (this.arrangement.length && this.onLoadSection) {
      this.onLoadSection(this.arrangement[0])
      this.sectionListeners.forEach((l) => l(0))
    }
    this.loopId = Tone.getTransport().scheduleRepeat((time) => this.tick(time), '16n')
    Tone.getTransport().start()
  }

  stop() {
    Tone.getTransport().stop()
    if (this.loopId !== null) {
      Tone.getTransport().clear(this.loopId)
      this.loopId = null
    }
    this.currentStep = 0
    Tone.getDraw().schedule(() => this.stepListeners.forEach((l) => l(-1)), Tone.now())
  }

  private tick(time: number) {
    const step = this.currentStep

    for (const voice of DRUM_VOICES) {
      if (this.drumPattern[voice][step]) this.triggerDrum(voice, time)
    }
    const bassNote = this.bassPattern[step]
    if (bassNote) this.bassSynth.triggerAttackRelease(bassNote, '16n', time)
    const leadNote = this.leadPattern[step]
    if (leadNote) this.leadSynth.triggerAttackRelease(leadNote, '8n', time)

    Tone.getDraw().schedule(() => this.stepListeners.forEach((l) => l(step)), time)

    this.currentStep = (this.currentStep + 1) % STEPS_PER_PATTERN
    if (this.currentStep === 0) {
      this.barCounter++
      if (this.barCounter >= this.barsPerSection && this.arrangement.length > 0) {
        this.barCounter = 0
        this.arrangementIndex = (this.arrangementIndex + 1) % this.arrangement.length
        const sectionId = this.arrangement[this.arrangementIndex]
        Tone.getDraw().schedule(() => {
          this.onLoadSection?.(sectionId)
          this.sectionListeners.forEach((l) => l(this.arrangementIndex))
        }, time)
      }
    }
  }

  // ---------- Patterns ----------

  setDrumPattern(pattern: DrumPattern) {
    this.drumPattern = pattern
  }

  setBassPattern(pattern: (string | null)[]) {
    this.bassPattern = pattern
  }

  setLeadPattern(pattern: (string | null)[]) {
    this.leadPattern = pattern
  }

  // ---------- Drum triggering ----------

  triggerDrum(voice: DrumVoice, time?: number) {
    const t = time ?? Tone.now()
    switch (voice) {
      case 'kick':
        this.kick.triggerAttackRelease('C1', '8n', t)
        if (this.sidechainEnabled) this.pumpSidechain(t)
        break
      case 'snare':
        this.snareNoise.triggerAttackRelease('8n', t)
        break
      case 'closedHat':
        this.hatClosed.triggerAttackRelease('32n', t)
        break
      case 'openHat':
        this.hatOpen.triggerAttackRelease('8n', t)
        break
      case 'clap': {
        this.clapNoise.triggerAttackRelease('16n', t)
        this.clapNoise.triggerAttackRelease('16n', t + 0.015)
        this.clapNoise.triggerAttackRelease('16n', t + 0.03)
        break
      }
      case 'tom':
        this.tom.triggerAttackRelease('G2', '8n', t)
        break
    }
  }

  private pumpSidechain(time: number) {
    const depth = 1 - this.sidechainAmount
    const stepDuration = Tone.Time('16n').toSeconds()
    this.duck.gain.cancelScheduledValues(time)
    this.duck.gain.setValueAtTime(depth, time)
    this.duck.gain.linearRampToValueAtTime(1, time + stepDuration * 3.5)
  }

  setSidechainAmount(amount: number) {
    this.sidechainAmount = Math.min(1, Math.max(0, amount))
  }

  setSidechainEnabled(enabled: boolean) {
    this.sidechainEnabled = enabled
    if (!enabled) this.duck.gain.cancelScheduledValues(Tone.now())
    this.duck.gain.value = 1
  }

  // ---------- Keys synth (live playable) ----------

  noteOn(note: string, velocity = 0.9) {
    this.keysSynth.triggerAttack(note, undefined, velocity)
  }

  noteOff(note: string) {
    this.keysSynth.triggerRelease(note)
  }

  setKeysOscillator(type: BasicOscillatorType) {
    this.keysSynth.set({ oscillator: { type } })
  }

  setKeysEnvelope(partial: Partial<{ attack: number; decay: number; sustain: number; release: number }>) {
    this.keysSynth.set({ envelope: partial })
  }

  // ---------- Bass / Lead synth params ----------

  setBassFilterCutoff(hz: number) {
    this.bassSynth.filter.frequency.rampTo(hz, 0.05)
  }

  setBassOscillator(type: BasicOscillatorType) {
    this.bassSynth.set({ oscillator: { type } })
  }

  setLeadOscillator(type: BasicOscillatorType) {
    this.leadSynth.set({ oscillator: { type } })
  }

  setWobbleEnabled(enabled: boolean) {
    this.wobbleEnabled = enabled
    if (enabled) this.wobbleLfo.start()
    else {
      this.wobbleLfo.stop()
      this.leadSynth.filter.frequency.rampTo(800, 0.1)
    }
  }

  setWobbleRate(subdivision: string) {
    this.wobbleLfo.frequency.value = subdivision
  }

  get isWobbleEnabled() {
    return this.wobbleEnabled
  }

  // ---------- Effects & master ----------

  setMasterVolume(db: number) {
    this.masterGain.gain.rampTo(Tone.dbToGain(db), 0.05)
  }

  setReverbWet(wet: number) {
    this.reverb.wet.rampTo(wet, 0.05)
  }

  setDelayWet(wet: number) {
    this.delay.wet.rampTo(wet, 0.05)
  }

  setMasterFilterCutoff(hz: number) {
    this.masterFilter.frequency.rampTo(hz, 0.05)
  }

  async previewNote(note = 'C4') {
    await this.start()
    this.keysSynth.triggerAttackRelease(note, '8n')
  }

  // ---------- Real-time recording (captures exactly what you hear) ----------

  get recorderMimeType() {
    return this.recorder.mimeType
  }

  async startRecording() {
    await this.recorder.start()
  }

  async stopRecording(): Promise<Blob> {
    return this.recorder.stop()
  }
}

export const audioEngine = new AudioEngine()
