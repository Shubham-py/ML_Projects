import { midiToNoteString, noteNameToMidi, scaleNotes, SCALES, type NoteName } from '../lib/musicTheory'

interface PianoRollProps {
  label: string
  color: string
  notes: (string | null)[]
  onChange: (notes: (string | null)[]) => void
  scaleKey: keyof typeof SCALES
  rootNote: NoteName
  baseOctave: number
  currentStep: number
  onPreview: (note: string) => void
}

export default function PianoRoll({
  label,
  color,
  notes,
  onChange,
  scaleKey,
  rootNote,
  baseOctave,
  currentStep,
  onPreview,
}: PianoRollProps) {
  const rootMidi = noteNameToMidi(rootNote, baseOctave)
  const rowMidis = scaleNotes(rootMidi, scaleKey, 2).reverse()

  const toggle = (step: number, noteString: string) => {
    const next = [...notes]
    next[step] = next[step] === noteString ? null : noteString
    onChange(next)
    if (next[step]) onPreview(noteString)
  }

  const clearAll = () => onChange(new Array(16).fill(null))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color }}>
          {label}
        </h3>
        <button onClick={clearAll} className="text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-danger,#f16b6b)]">
          clear
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {rowMidis.map((midi) => {
            const noteString = midiToNoteString(midi)
            const isRoot = ((midi - rootMidi) % 12 + 12) % 12 === 0
            return (
              <div key={midi} className="flex items-center gap-1">
                <button
                  onClick={() => onPreview(noteString)}
                  className={`w-14 shrink-0 rounded px-1.5 py-1 text-right text-[10px] font-mono ${
                    isRoot ? 'text-[var(--color-text-bright)] font-bold' : 'text-[var(--color-text-dim)]'
                  }`}
                >
                  {noteString}
                </button>
                <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                  {Array.from({ length: 16 }, (_, step) => {
                    const active = notes[step] === noteString
                    return (
                      <button
                        key={step}
                        onClick={() => toggle(step, noteString)}
                        className={`h-5 rounded-sm transition-colors ${
                          active ? '' : isRoot ? 'bg-[var(--color-bg-soft)]' : 'bg-[var(--color-bg-soft)]/50 hover:bg-[var(--color-border)]'
                        } ${currentStep === step ? 'ring-1 ring-white' : ''} ${step % 4 === 0 ? 'border-l border-[var(--color-border)]' : ''}`}
                        style={active ? { backgroundColor: color } : undefined}
                        aria-label={`${noteString} step ${step + 1}`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
