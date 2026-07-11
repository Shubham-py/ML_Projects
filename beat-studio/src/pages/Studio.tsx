import { useEffect, useRef, useState } from 'react'
import TransportBar from '../components/TransportBar'
import DrumSequencer from '../components/DrumSequencer'
import PianoRoll from '../components/PianoRoll'
import PianoKeyboard from '../components/PianoKeyboard'
import EffectsRack from '../components/EffectsRack'
import ArrangementView from '../components/ArrangementView'
import InstrumentPanel from '../components/InstrumentPanel'
import { audioEngine } from '../lib/audioEngine'
import { useAudioEngine } from '../lib/useAudioEngine'
import { starterProject, type Project } from '../lib/patterns'
import type { DrumVoice } from '../lib/musicTheory'

const STORAGE_KEY = 'beat-studio-project-v1'
type Tab = 'drums' | 'bass' | 'lead' | 'keys' | 'effects' | 'arrangement'

function loadProject(): Project | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Studio() {
  const { ensureStarted } = useAudioEngine()
  const [project, setProject] = useState<Project>(() => loadProject() ?? starterProject())
  const [activePatternId, setActivePatternId] = useState(project.patterns[0].id)
  const [tab, setTab] = useState<Tab>('drums')
  const [mode, setMode] = useState<'pattern' | 'song'>('pattern')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [masterVolume, setMasterVolume] = useState(-6)
  const [isRecording, setIsRecording] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const projectRef = useRef(project)
  projectRef.current = project

  const activePattern = project.patterns.find((p) => p.id === activePatternId) ?? project.patterns[0]

  const updateActivePattern = (updater: (p: typeof activePattern) => typeof activePattern) => {
    setProject((prev) => ({
      ...prev,
      patterns: prev.patterns.map((p) => (p.id === activePatternId ? updater(p) : p)),
    }))
  }

  // Step/section playhead listeners
  useEffect(() => {
    const offStep = audioEngine.onStep(setCurrentStep)
    const offSection = audioEngine.onSectionChange(setCurrentSectionIndex)
    return () => {
      offStep()
      offSection()
    }
  }, [])

  // Push the correct arrangement into the engine whenever mode/arrangement/bars/active pattern changes.
  useEffect(() => {
    const loadSection = (patternId: string) => {
      const pattern = projectRef.current.patterns.find((p) => p.id === patternId)
      if (!pattern) return
      audioEngine.setDrumPattern(pattern.drum)
      audioEngine.setBassPattern(pattern.bass)
      audioEngine.setLeadPattern(pattern.lead)
    }
    if (mode === 'song') {
      audioEngine.setArrangement(project.arrangement.length ? project.arrangement : [activePatternId], project.barsPerSection, loadSection)
    } else {
      audioEngine.setArrangement([activePatternId], 1, loadSection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, project.arrangement, project.barsPerSection, activePatternId])

  // Live-update the engine whenever the active pattern's content changes (immediate feedback while editing).
  useEffect(() => {
    if (mode !== 'pattern') return
    audioEngine.setDrumPattern(activePattern.drum)
    audioEngine.setBassPattern(activePattern.bass)
    audioEngine.setLeadPattern(activePattern.lead)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, activePattern])

  useEffect(() => {
    audioEngine.setBpm(project.bpm)
  }, [project.bpm])

  useEffect(() => {
    audioEngine.setMasterVolume(masterVolume)
  }, [masterVolume])

  // Instrument/plugin swaps and their params — pushed to the engine whenever they change.
  useEffect(() => {
    audioEngine.setBassInstrument(project.bassInstrument.type, project.bassInstrument.params)
  }, [project.bassInstrument.type])

  useEffect(() => {
    audioEngine.setBassParams(project.bassInstrument.params)
  }, [project.bassInstrument.params])

  useEffect(() => {
    audioEngine.setLeadInstrument(project.leadInstrument.type, project.leadInstrument.params)
  }, [project.leadInstrument.type])

  useEffect(() => {
    audioEngine.setLeadParams(project.leadInstrument.params)
  }, [project.leadInstrument.params])

  useEffect(() => {
    audioEngine.setKeysInstrument(project.keysInstrument.type, project.keysInstrument.params)
  }, [project.keysInstrument.type])

  useEffect(() => {
    audioEngine.setKeysParams(project.keysInstrument.params)
  }, [project.keysInstrument.params])

  useEffect(() => {
    audioEngine.setBassFilterCutoff(project.bassFilterHz)
  }, [project.bassFilterHz])

  useEffect(() => {
    audioEngine.setLeadFilterCutoff(project.leadFilterHz)
  }, [project.leadFilterHz])

  useEffect(() => {
    audioEngine.setWobbleEnabled(project.wobbleEnabled)
  }, [project.wobbleEnabled])

  useEffect(() => {
    audioEngine.setWobbleRate(project.wobbleRate)
  }, [project.wobbleRate])

  const togglePlay = async () => {
    await ensureStarted()
    if (isPlaying) {
      audioEngine.stop()
      setIsPlaying(false)
    } else {
      audioEngine.play()
      setIsPlaying(true)
    }
  }

  const toggleRecord = async () => {
    await ensureStarted()
    if (isRecording) {
      const blob = await audioEngine.stopRecording()
      setIsRecording(false)
      const ext = audioEngine.recorderMimeType.includes('webm') ? 'webm' : 'ogg'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      await audioEngine.startRecording()
      setIsRecording(true)
      if (!isPlaying) {
        audioEngine.play()
        setIsPlaying(true)
      }
    }
  }

  const previewDrum = async (voice: DrumVoice) => {
    await ensureStarted()
    audioEngine.triggerDrum(voice)
  }

  const saveProject = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(null), 1500)
  }

  const newProject = () => {
    if (isPlaying) {
      audioEngine.stop()
      setIsPlaying(false)
    }
    const fresh = starterProject()
    setProject(fresh)
    setActivePatternId(fresh.patterns[0].id)
  }

  const exportProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importProject = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed?.patterns) || parsed.patterns.length === 0) {
        throw new Error('Missing patterns array')
      }
      if (isPlaying) {
        audioEngine.stop()
        setIsPlaying(false)
      }
      const merged: Project = { ...starterProject(), ...parsed }
      setProject(merged)
      setActivePatternId(merged.patterns[0].id)
      setSaveStatus('Imported!')
      setTimeout(() => setSaveStatus(null), 1500)
    } catch {
      setSaveStatus('Import failed — not a valid project file')
      setTimeout(() => setSaveStatus(null), 2500)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'drums', label: 'Drums' },
    { key: 'bass', label: 'Bass' },
    { key: 'lead', label: 'Lead' },
    { key: 'keys', label: 'Keys' },
    { key: 'effects', label: 'Effects' },
    { key: 'arrangement', label: 'Arrangement' },
  ]

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) importProject(file)
          e.target.value = ''
        }}
      />

      <TransportBar
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        bpm={project.bpm}
        onBpmChange={(bpm) => setProject((p) => ({ ...p, bpm }))}
        mode={mode}
        onModeChange={setMode}
        masterVolume={masterVolume}
        onMasterVolumeChange={setMasterVolume}
        isRecording={isRecording}
        onToggleRecord={toggleRecord}
        projectName={project.name}
        onProjectNameChange={(name) => setProject((p) => ({ ...p, name }))}
        onSave={saveProject}
        onNew={newProject}
        onExport={exportProject}
        onImportClick={() => fileInputRef.current?.click()}
        saveStatus={saveStatus}
      />

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[var(--color-border)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.key ? 'border-[var(--color-neon-purple)] text-[var(--color-neon-purple)]' : 'border-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text-bright)]'
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5 px-2 text-xs text-[var(--color-text-dim)]">
          Editing: <span className="font-semibold" style={{ color: activePattern.color }}>{activePattern.name}</span>
        </span>
      </div>

      {tab === 'drums' && (
        <DrumSequencer
          pattern={activePattern.drum}
          onChange={(drum) => updateActivePattern((p) => ({ ...p, drum }))}
          currentStep={currentStep}
          onPreview={previewDrum}
        />
      )}

      {tab === 'bass' && (
        <div className="space-y-4">
          <InstrumentPanel
            label="Bass"
            color="var(--color-neon-purple)"
            settings={project.bassInstrument}
            onChange={(bassInstrument) => setProject((p) => ({ ...p, bassInstrument }))}
          />
          <label className="flex max-w-sm flex-col gap-1 text-xs text-[var(--color-text-dim)]">
            <span>Filter cutoff ({Math.round(project.bassFilterHz)} Hz)</span>
            <input
              type="range"
              min={80}
              max={4000}
              step={10}
              value={project.bassFilterHz}
              onChange={(e) => setProject((p) => ({ ...p, bassFilterHz: Number(e.target.value) }))}
              className="accent-[var(--color-neon-purple)]"
            />
          </label>
          <PianoRoll
            label="Bass"
            color="var(--color-neon-purple)"
            notes={activePattern.bass}
            onChange={(bass) => updateActivePattern((p) => ({ ...p, bass }))}
            scaleKey="minor"
            rootNote="A"
            baseOctave={1}
            currentStep={currentStep}
            onPreview={async (note) => {
              await ensureStarted()
              audioEngine.previewBass(note)
            }}
          />
        </div>
      )}

      {tab === 'lead' && (
        <div className="space-y-4">
          <InstrumentPanel
            label="Lead"
            color="var(--color-neon-yellow)"
            settings={project.leadInstrument}
            onChange={(leadInstrument) => setProject((p) => ({ ...p, leadInstrument }))}
          />
          <div className="flex flex-wrap items-end gap-6">
            <label className="flex max-w-sm flex-1 flex-col gap-1 text-xs text-[var(--color-text-dim)]">
              <span>Filter cutoff ({Math.round(project.leadFilterHz)} Hz)</span>
              <input
                type="range"
                min={200}
                max={8000}
                step={10}
                value={project.leadFilterHz}
                onChange={(e) => setProject((p) => ({ ...p, leadFilterHz: Number(e.target.value) }))}
                className="accent-[var(--color-neon-yellow)]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
              <input
                type="checkbox"
                checked={project.wobbleEnabled}
                onChange={(e) => setProject((p) => ({ ...p, wobbleEnabled: e.target.checked }))}
                className="accent-[var(--color-neon-yellow)]"
              />
              Wobble (LFO on filter cutoff)
            </label>
            {project.wobbleEnabled && (
              <div className="flex gap-2">
                {['4n', '8n', '16n', '8t'].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setProject((p) => ({ ...p, wobbleRate: rate }))}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      project.wobbleRate === rate ? 'border-[var(--color-neon-yellow)] text-[var(--color-neon-yellow)]' : 'border-[var(--color-border)] text-[var(--color-text-dim)]'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            )}
          </div>
          <PianoRoll
            label="Lead"
            color="var(--color-neon-yellow)"
            notes={activePattern.lead}
            onChange={(lead) => updateActivePattern((p) => ({ ...p, lead }))}
            scaleKey="minor"
            rootNote="A"
            baseOctave={3}
            currentStep={currentStep}
            onPreview={async (note) => {
              await ensureStarted()
              audioEngine.previewLead(note)
            }}
          />
        </div>
      )}

      {tab === 'keys' && (
        <div className="space-y-4">
          <InstrumentPanel
            label="Keys"
            color="var(--color-neon-cyan)"
            allowPluck={false}
            settings={project.keysInstrument}
            onChange={(keysInstrument) => setProject((p) => ({ ...p, keysInstrument }))}
          />
          <PianoKeyboard
            showEnvelope={project.keysInstrument.type === 'analog' || project.keysInstrument.type === 'fm' || project.keysInstrument.type === 'am'}
            envelope={project.keysEnvelope}
            onEnvelopeChange={(keysEnvelope) => setProject((p) => ({ ...p, keysEnvelope }))}
          />
        </div>
      )}

      {tab === 'effects' && (
        <EffectsRack
          reverbWet={project.reverbWet}
          onReverbChange={(reverbWet) => setProject((p) => ({ ...p, reverbWet }))}
          delayWet={project.delayWet}
          onDelayChange={(delayWet) => setProject((p) => ({ ...p, delayWet }))}
          sidechainAmount={project.sidechainAmount}
          onSidechainAmountChange={(sidechainAmount) => setProject((p) => ({ ...p, sidechainAmount }))}
          sidechainEnabled={project.sidechainEnabled}
          onSidechainEnabledChange={(sidechainEnabled) => setProject((p) => ({ ...p, sidechainEnabled }))}
        />
      )}

      {tab === 'arrangement' && (
        <ArrangementView
          patterns={project.patterns}
          onPatternsChange={(patterns) => setProject((p) => ({ ...p, patterns }))}
          activePatternId={activePatternId}
          onActivePatternChange={setActivePatternId}
          arrangement={project.arrangement}
          onArrangementChange={(arrangement) => setProject((p) => ({ ...p, arrangement }))}
          barsPerSection={project.barsPerSection}
          onBarsPerSectionChange={(barsPerSection) => setProject((p) => ({ ...p, barsPerSection }))}
          currentSectionIndex={currentSectionIndex}
          mode={mode}
        />
      )}
    </div>
  )
}
