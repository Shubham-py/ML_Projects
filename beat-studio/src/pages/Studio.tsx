import { useEffect, useRef, useState } from 'react'
import TransportBar from '../components/TransportBar'
import DrumSequencer from '../components/DrumSequencer'
import PianoRoll from '../components/PianoRoll'
import PianoKeyboard from '../components/PianoKeyboard'
import EffectsRack from '../components/EffectsRack'
import ArrangementView from '../components/ArrangementView'
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
            audioEngine.noteOn(note)
            setTimeout(() => audioEngine.noteOff(note), 200)
          }}
        />
      )}

      {tab === 'lead' && (
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
            audioEngine.noteOn(note)
            setTimeout(() => audioEngine.noteOff(note), 200)
          }}
        />
      )}

      {tab === 'keys' && <PianoKeyboard />}

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
