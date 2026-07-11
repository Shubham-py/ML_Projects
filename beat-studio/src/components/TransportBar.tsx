interface TransportBarProps {
  isPlaying: boolean
  onTogglePlay: () => void
  bpm: number
  onBpmChange: (bpm: number) => void
  mode: 'pattern' | 'song'
  onModeChange: (mode: 'pattern' | 'song') => void
  masterVolume: number
  onMasterVolumeChange: (db: number) => void
  isRecording: boolean
  onToggleRecord: () => void
  projectName: string
  onProjectNameChange: (name: string) => void
  onSave: () => void
  onNew: () => void
  saveStatus: string | null
}

export default function TransportBar({
  isPlaying,
  onTogglePlay,
  bpm,
  onBpmChange,
  mode,
  onModeChange,
  masterVolume,
  onMasterVolumeChange,
  isRecording,
  onToggleRecord,
  projectName,
  onProjectNameChange,
  onSave,
  onNew,
  saveStatus,
}: TransportBarProps) {
  return (
    <div className="sticky top-[57px] z-30 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 mb-4">
      <button
        onClick={onTogglePlay}
        className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold transition-colors ${
          isPlaying
            ? 'bg-[var(--color-neon-pink)] text-black glow-pink'
            : 'bg-[var(--color-neon-purple)] text-black glow-purple'
        }`}
        aria-label={isPlaying ? 'Stop' : 'Play'}
      >
        {isPlaying ? '■' : '▶'}
      </button>

      <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-semibold">
        <button
          onClick={() => onModeChange('pattern')}
          className={`px-3 py-2 transition-colors ${mode === 'pattern' ? 'bg-[var(--color-accent-soft)] text-[var(--color-neon-purple)]' : 'text-[var(--color-text-dim)]'}`}
        >
          Pattern
        </button>
        <button
          onClick={() => onModeChange('song')}
          className={`px-3 py-2 transition-colors ${mode === 'song' ? 'bg-[var(--color-accent-soft)] text-[var(--color-neon-purple)]' : 'text-[var(--color-text-dim)]'}`}
        >
          Song
        </button>
      </div>

      <label className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
        BPM
        <input
          type="number"
          min={60}
          max={200}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-1 text-[var(--color-text-bright)]"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
        Volume
        <input
          type="range"
          min={-40}
          max={0}
          value={masterVolume}
          onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
          className="w-24 accent-[var(--color-neon-purple)]"
        />
      </label>

      <button
        onClick={onToggleRecord}
        className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
          isRecording
            ? 'border-red-500 bg-red-500/20 text-red-400'
            : 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
        }`}
      >
        {isRecording ? '● Recording…' : '● Record'}
      </button>

      <div className="flex-1 min-w-[140px]" />

      <input
        value={projectName}
        onChange={(e) => onProjectNameChange(e.target.value)}
        className="w-40 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-soft)] px-2 py-1.5 text-sm text-[var(--color-text-bright)]"
        placeholder="Project name"
      />
      <button
        onClick={onSave}
        className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]"
      >
        Save
      </button>
      <button
        onClick={onNew}
        className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]"
      >
        New
      </button>
      {saveStatus && <span className="text-xs text-[var(--color-neon-cyan)]">{saveStatus}</span>}
    </div>
  )
}
