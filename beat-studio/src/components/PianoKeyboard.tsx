import { useEffect, useState } from 'react'
import { KEYBOARD_NOTE_MAP, midiToNoteString, noteNameToMidi } from '../lib/musicTheory'
import { audioEngine } from '../lib/audioEngine'
import { useAudioEngine } from '../lib/useAudioEngine'

const KEY_ORDER = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';']
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16]
const BLACK_KEYS: { offset: number; whiteIndexBefore: number }[] = [
  { offset: 1, whiteIndexBefore: 0 },
  { offset: 3, whiteIndexBefore: 1 },
  { offset: 6, whiteIndexBefore: 3 },
  { offset: 8, whiteIndexBefore: 4 },
  { offset: 10, whiteIndexBefore: 5 },
  { offset: 13, whiteIndexBefore: 7 },
  { offset: 15, whiteIndexBefore: 8 },
]

interface Envelope {
  attack: number
  decay: number
  sustain: number
  release: number
}

interface PianoKeyboardProps {
  showEnvelope: boolean
  envelope: Envelope
  onEnvelopeChange: (envelope: Envelope) => void
}

export default function PianoKeyboard({ showEnvelope, envelope, onEnvelopeChange }: PianoKeyboardProps) {
  const { ensureStarted } = useAudioEngine()
  const [octave, setOctave] = useState(3)
  const [activeOffsets, setActiveOffsets] = useState<Set<number>>(new Set())

  const rootMidi = noteNameToMidi('C', octave)

  const pressKey = async (offset: number) => {
    await ensureStarted()
    const note = midiToNoteString(rootMidi + offset)
    audioEngine.noteOn(note)
    setActiveOffsets((prev) => new Set(prev).add(offset))
  }

  const releaseKey = (offset: number) => {
    const note = midiToNoteString(rootMidi + offset)
    audioEngine.noteOff(note)
    setActiveOffsets((prev) => {
      const next = new Set(prev)
      next.delete(offset)
      return next
    })
  }

  useEffect(() => {
    const pressed = new Set<string>()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      if (!(key in KEYBOARD_NOTE_MAP) || pressed.has(key)) return
      pressed.add(key)
      pressKey(KEYBOARD_NOTE_MAP[key])
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (!(key in KEYBOARD_NOTE_MAP)) return
      pressed.delete(key)
      releaseKey(KEYBOARD_NOTE_MAP[key])
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [octave])

  const whiteWidth = 100 / WHITE_OFFSETS.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
        <span>Octave</span>
        <button onClick={() => setOctave((o) => Math.max(1, o - 1))} className="rounded border border-[var(--color-border)] px-2 py-1">
          −
        </button>
        <span className="w-4 text-center text-[var(--color-text-bright)]">{octave}</span>
        <button onClick={() => setOctave((o) => Math.min(6, o + 1))} className="rounded border border-[var(--color-border)] px-2 py-1">
          +
        </button>
      </div>

      {showEnvelope && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(['attack', 'decay', 'sustain', 'release'] as const).map((param) => (
            <label key={param} className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
              <span className="capitalize">
                {param} ({envelope[param].toFixed(2)})
              </span>
              <input
                type="range"
                min={0}
                max={param === 'sustain' ? 1 : 2}
                step={0.01}
                value={envelope[param]}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  const next = { ...envelope, [param]: value }
                  onEnvelopeChange(next)
                  audioEngine.setKeysEnvelope({ [param]: value })
                }}
                className="accent-[var(--color-neon-purple)]"
              />
            </label>
          ))}
        </div>
      )}

      <div className="relative h-40 w-full select-none">
        <div className="flex h-full w-full gap-0.5">
          {WHITE_OFFSETS.map((offset) => (
            <button
              key={offset}
              onMouseDown={() => pressKey(offset)}
              onMouseUp={() => releaseKey(offset)}
              onMouseLeave={() => releaseKey(offset)}
              onTouchStart={(e) => {
                e.preventDefault()
                pressKey(offset)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                releaseKey(offset)
              }}
              className={`piano-key-white relative flex-1 rounded-b-md border border-[var(--color-border)] pb-2 text-[10px] text-black/60 ${
                activeOffsets.has(offset) ? 'active' : ''
              }`}
            >
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono uppercase">{KEY_ORDER[offset]}</span>
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex h-[62%]">
          {BLACK_KEYS.map(({ offset, whiteIndexBefore }) => (
            <button
              key={offset}
              onMouseDown={() => pressKey(offset)}
              onMouseUp={() => releaseKey(offset)}
              onMouseLeave={() => releaseKey(offset)}
              onTouchStart={(e) => {
                e.preventDefault()
                pressKey(offset)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                releaseKey(offset)
              }}
              className={`piano-key-black pointer-events-auto absolute top-0 h-full rounded-b-md text-[9px] text-white/60 ${
                activeOffsets.has(offset) ? 'active' : ''
              }`}
              style={{ left: `calc(${(whiteIndexBefore + 1) * whiteWidth}% - 2.2%)`, width: '4.4%' }}
            >
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono uppercase">{KEY_ORDER[offset]}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-[var(--color-text-dim)]">
        Play with your computer keyboard (A W S E D F T G Y H U J K O L P) or click/tap the keys.
      </p>
    </div>
  )
}
