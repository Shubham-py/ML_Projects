import { useState } from 'react'
import type { Pattern } from '../lib/patterns'
import { emptyDrumPattern, emptyMelodyPattern } from '../lib/audioEngine'

interface ArrangementViewProps {
  patterns: Pattern[]
  onPatternsChange: (patterns: Pattern[]) => void
  activePatternId: string
  onActivePatternChange: (id: string) => void
  arrangement: string[]
  onArrangementChange: (arrangement: string[]) => void
  barsPerSection: number
  onBarsPerSectionChange: (bars: number) => void
  currentSectionIndex: number
  mode: 'pattern' | 'song'
}

const PALETTE = ['var(--color-neon-pink)', 'var(--color-neon-cyan)', 'var(--color-neon-yellow)', 'var(--color-neon-purple)', 'var(--color-neon-orange)']

export default function ArrangementView({
  patterns,
  onPatternsChange,
  activePatternId,
  onActivePatternChange,
  arrangement,
  onArrangementChange,
  barsPerSection,
  onBarsPerSectionChange,
  currentSectionIndex,
  mode,
}: ArrangementViewProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)

  const addPattern = () => {
    const id = `pattern-${Date.now()}`
    const color = PALETTE[patterns.length % PALETTE.length]
    const blank: Pattern = { id, name: `Pattern ${patterns.length + 1}`, color, drum: emptyDrumPattern(), bass: emptyMelodyPattern(), lead: emptyMelodyPattern() }
    onPatternsChange([...patterns, blank])
    onActivePatternChange(id)
  }

  const duplicatePattern = (source: Pattern) => {
    const id = `pattern-${Date.now()}`
    const copy: Pattern = { ...source, id, name: `${source.name} copy` }
    onPatternsChange([...patterns, copy])
    onActivePatternChange(id)
  }

  const deletePattern = (id: string) => {
    if (patterns.length <= 1) return
    onPatternsChange(patterns.filter((p) => p.id !== id))
    onArrangementChange(arrangement.filter((sectionId) => sectionId !== id))
    if (activePatternId === id) onActivePatternChange(patterns[0].id === id ? patterns[1].id : patterns[0].id)
  }

  const renamePattern = (id: string, name: string) => {
    onPatternsChange(patterns.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const addToArrangement = (id: string) => onArrangementChange([...arrangement, id])
  const removeFromArrangement = (index: number) => onArrangementChange(arrangement.filter((_, i) => i !== index))
  const moveSlot = (index: number, dir: -1 | 1) => {
    const next = [...arrangement]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onArrangementChange(next)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-bright)]">Patterns</h3>
          <button onClick={addPattern} className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]">
            + New pattern
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--color-text-dim)]">
          The selected pattern is what you edit in the Drums/Bass/Lead tabs. In "Pattern" transport mode it loops on its own; in
          "Song" mode, patterns play back-to-back following the arrangement below.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {patterns.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                activePatternId === p.id ? 'border-[var(--color-text-bright)]' : 'border-[var(--color-border)]'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              {renamingId === p.id ? (
                <input
                  autoFocus
                  defaultValue={p.name}
                  onBlur={(e) => {
                    renamePattern(p.id, e.target.value || p.name)
                    setRenamingId(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  className="w-24 rounded border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-1 text-xs text-[var(--color-text-bright)]"
                />
              ) : (
                <button onClick={() => onActivePatternChange(p.id)} className="text-xs font-medium text-[var(--color-text-bright)]">
                  {p.name}
                </button>
              )}
              <button onClick={() => setRenamingId(p.id)} className="text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]">
                rename
              </button>
              <button onClick={() => duplicatePattern(p)} className="text-[10px] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]">
                dup
              </button>
              <button onClick={() => addToArrangement(p.id)} className="text-[10px] text-[var(--color-neon-cyan)]">
                +arr
              </button>
              {patterns.length > 1 && (
                <button onClick={() => deletePattern(p.id)} className="text-[10px] text-[var(--color-text-dim)] hover:text-red-400">
                  del
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-bright)]">Song Arrangement</h3>
          <label className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
            Bars per section
            <input
              type="number"
              min={1}
              max={8}
              value={barsPerSection}
              onChange={(e) => onBarsPerSectionChange(Number(e.target.value))}
              className="w-14 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-1 text-[var(--color-text-bright)]"
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-[var(--color-text-dim)]">
          Chain patterns into a song structure — e.g. Intro → Build-Up → Drop → Drop → Breakdown → Drop. Switch the transport to
          "Song" mode to play the full arrangement.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {arrangement.length === 0 && <span className="text-xs text-[var(--color-text-dim)]">No sections yet — click "+arr" on a pattern above.</span>}
          {arrangement.map((id, i) => {
            const pattern = patterns.find((p) => p.id === id)
            if (!pattern) return null
            return (
              <div
                key={`${id}-${i}`}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs ${
                  mode === 'song' && currentSectionIndex === i ? 'border-white' : 'border-[var(--color-border)]'
                }`}
                style={{ backgroundColor: `${pattern.color}22` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pattern.color }} />
                {pattern.name}
                <button onClick={() => moveSlot(i, -1)} className="text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]">
                  ←
                </button>
                <button onClick={() => moveSlot(i, 1)} className="text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]">
                  →
                </button>
                <button onClick={() => removeFromArrangement(i)} className="text-[var(--color-text-dim)] hover:text-red-400">
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
