import * as Tone from 'tone'
import { DRUM_VOICES, type DrumVoice } from './musicTheory'
import { applyParams, createMonoVoice, createPolyVoice, type InstrumentType, type MonoVoice } from './instruments'

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

class AudioEngine {
  private ready = false

  private masterGain = new Tone.Gain(0.85)
  private duck = new Tone.Gain(1)
  private masterFilter = new Tone.Filter(20000, 'lowpass')
  private delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.25, wet: 0 })
  private reverb = new Tone.Reverb({ decay: 2.5, wet: 0 })
  private limiter = new Tone.Limiter(-1)
  private recorder = new Tone.Recorder()

  private keysVoice: Tone.PolySynth = createPolyVoice('analog')
  private keysInstrumentType: InstrumentType = 'analog'

  private bassVoice: MonoVoice = createMonoVoice('analog')
  private bassInstrumentType: InstrumentType = 'analog'
  private bassFilter = new Tone.Filter({ frequency: 400, type: 'lowpass', rolloff: -24, Q: 2 })

  private leadVoice: MonoVoice = createMonoVoice('analog')
  private leadInstrumentType: InstrumentType = 'analog'
  private leadFilter = new Tone.Filter({ frequency: 800, type: 'lowpass', rolloff: -12, Q: 1 })

  private wobbleLfo = new Tone.LFO({ frequency: '8n', min: 200, max: 3000 })
  private wobbleEnabled = false
  private leadFilterBaseHz = 800

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

    this.keysVoice.connect(this.masterGain)
    this.bassVoice.chain(this.bassFilter, this.masterGain)
    this.leadVoice.chain(this.leadFilter, this.masterGain)
    this.kick.connect(this.masterGain)
    this.snareNoise.chain(this.snareFilter, this.masterGain)
    this.hatClosed.connect(this.masterGain)
    this.hatOpen.connect(this.masterGain)
    this.clapNoise.connect(this.masterGain)
    this.tom.connect(this.masterGain)

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
    if (bassNote) this.bassVoice.triggerAttackRelease(bassNote, '16n', time)
    const leadNote = this.leadPattern[step]
    if (leadNote) this.leadVoice.triggerAttackRelease(leadNote, '8n', time)

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
    this.keysVoice.triggerAttack(note, undefined, velocity)
  }

  noteOff(note: string) {
    this.keysVoice.triggerRelease(note)
  }

  previewBass(note: string, duration = '8n') {
    this.bassVoice.triggerAttackRelease(note, duration)
  }

  previewLead(note: string, duration = '8n') {
    this.leadVoice.triggerAttackRelease(note, duration)
  }

  setKeysEnvelope(partial: Partial<{ attack: number; decay: number; sustain: number; release: number }>) {
    this.keysVoice.set({ envelope: partial } as never)
  }

  setKeysInstrument(type: InstrumentType, params: Record<string, number | string>) {
    this.keysVoice.disconnect()
    this.keysVoice.dispose()
    this.keysVoice = createPolyVoice(type)
    this.keysVoice.connect(this.masterGain)
    this.keysInstrumentType = type
    applyParams(this.keysVoice, type === 'pluck' ? 'analog' : type, params)
  }

  setKeysParams(params: Record<string, number | string>) {
    applyParams(this.keysVoice, this.keysInstrumentType === 'pluck' ? 'analog' : this.keysInstrumentType, params)
  }

  // ---------- Bass / Lead instruments ----------

  setBassInstrument(type: InstrumentType, params: Record<string, number | string>) {
    this.bassVoice.disconnect()
    this.bassVoice.dispose()
    this.bassVoice = createMonoVoice(type)
    this.bassVoice.chain(this.bassFilter, this.masterGain)
    this.bassInstrumentType = type
    applyParams(this.bassVoice, type, params)
  }

  setBassParams(params: Record<string, number | string>) {
    applyParams(this.bassVoice, this.bassInstrumentType, params)
  }

  setBassFilterCutoff(hz: number) {
    this.bassFilter.frequency.rampTo(hz, 0.05)
  }

  setLeadInstrument(type: InstrumentType, params: Record<string, number | string>) {
    this.leadVoice.disconnect()
    this.leadVoice.dispose()
    this.leadVoice = createMonoVoice(type)
    this.leadVoice.chain(this.leadFilter, this.masterGain)
    this.leadInstrumentType = type
    applyParams(this.leadVoice, type, params)
  }

  setLeadParams(params: Record<string, number | string>) {
    applyParams(this.leadVoice, this.leadInstrumentType, params)
  }

  setLeadFilterCutoff(hz: number) {
    this.leadFilterBaseHz = hz
    if (this.wobbleEnabled) {
      // Connecting the LFO marks this signal "overridden" (Tone.js doesn't clear that flag on
      // disconnect), so briefly detach and reset it to let the ramp land, then reattach.
      this.wobbleLfo.disconnect(this.leadFilter.frequency)
      this.leadFilter.frequency.overridden = false
      this.leadFilter.frequency.rampTo(hz, 0.05)
      this.wobbleLfo.connect(this.leadFilter.frequency)
    } else {
      this.leadFilter.frequency.rampTo(hz, 0.05)
    }
  }

  setWobbleEnabled(enabled: boolean) {
    if (enabled === this.wobbleEnabled) return
    this.wobbleEnabled = enabled
    if (enabled) {
      this.wobbleLfo.connect(this.leadFilter.frequency)
      this.wobbleLfo.start()
    } else {
      this.wobbleLfo.stop()
      this.wobbleLfo.disconnect(this.leadFilter.frequency)
      this.leadFilter.frequency.overridden = false
      this.leadFilter.frequency.rampTo(this.leadFilterBaseHz, 0.1)
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
