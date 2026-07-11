import { DRUM_VOICES, DRUM_VOICE_LABELS, type DrumVoice } from '../lib/musicTheory'
import type { DrumPattern } from '../lib/audioEngine'

interface DrumSequencerProps {
  pattern: DrumPattern
  onChange: (pattern: DrumPattern) => void
  currentStep: number
  onPreview: (voice: DrumVoice) => void
}

const voiceColors: Record<DrumVoice, string> = {
  kick: 'bg-[var(--color-neon-pink)]',
  snare: 'bg-[var(--color-neon-cyan)]',
  closedHat: 'bg-[var(--color-neon-yellow)]',
  openHat: 'bg-[var(--color-neon-orange)]',
  clap: 'bg-[var(--color-neon-purple)]',
  tom: 'bg-[#5ee6a0]',
}

export default function DrumSequencer({ pattern, onChange, currentStep, onPreview }: DrumSequencerProps) {
  const toggleStep = (voice: DrumVoice, step: number) => {
    const next: DrumPattern = { ...pattern, [voice]: [...pattern[voice]] }
    next[voice][step] = !next[voice][step]
    onChange(next)
  }

  const clearVoice = (voice: DrumVoice) => {
    const next: DrumPattern = { ...pattern, [voice]: new Array(16).fill(false) }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {DRUM_VOICES.map((voice) => (
        <div key={voice} className="flex items-center gap-2">
          <button
            onClick={() => onPreview(voice)}
            className="w-24 shrink-0 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-2 text-left text-xs font-semibold text-[var(--color-text)] hover:text-[var(--color-text-bright)]"
            title="Click to preview this sound"
          >
            {DRUM_VOICE_LABELS[voice]}
          </button>
          <div className="grid flex-1 grid-cols-16 gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {pattern[voice].map((active, step) => (
              <button
                key={step}
                onClick={() => toggleStep(voice, step)}
                className={`h-8 rounded transition-colors ${active ? voiceColors[voice] : 'bg-[var(--color-bg-soft)] hover:bg-[var(--color-border)]'} ${
                  currentStep === step ? 'ring-2 ring-white' : ''
                } ${step % 4 === 0 ? 'border-l-2 border-[var(--color-border)]' : ''}`}
                aria-label={`${voice} step ${step + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => clearVoice(voice)}
            className="shrink-0 rounded-md px-2 py-1 text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-danger,#f16b6b)]"
          >
            clear
          </button>
        </div>
      ))}
    </div>
  )
}
