import { INSTRUMENT_DESCRIPTIONS, INSTRUMENT_LABELS, INSTRUMENT_TYPES, defaultParamsFor, type InstrumentSettings, type InstrumentType } from '../lib/instruments'

const WAVEFORMS = ['sawtooth', 'square', 'sine', 'triangle'] as const

interface InstrumentPanelProps {
  label: string
  color: string
  allowPluck?: boolean
  settings: InstrumentSettings
  onChange: (settings: InstrumentSettings) => void
}

function Slider({ label, value, min, max, step = 0.01, onChange, format }: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--color-text-dim)]">
      <span>
        {label} ({format ? format(value) : value.toFixed(2)})
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[var(--color-neon-purple)]" />
    </label>
  )
}

export default function InstrumentPanel({ label, color, allowPluck = true, settings, onChange }: InstrumentPanelProps) {
  const types = allowPluck ? INSTRUMENT_TYPES : INSTRUMENT_TYPES.filter((t) => t !== 'pluck')
  const params = settings.params

  const setType = (type: InstrumentType) => {
    onChange({ type, params: defaultParamsFor(type) })
  }

  const setParam = (key: string, value: number | string) => {
    onChange({ type: settings.type, params: { ...params, [key]: value } })
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 space-y-3">
      <h3 className="text-sm font-semibold" style={{ color }}>
        {label} — Instrument
      </h3>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setType(type)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              settings.type === type ? 'border-[var(--color-text-bright)] text-[var(--color-text-bright)]' : 'border-[var(--color-border)] text-[var(--color-text-dim)]'
            }`}
            style={settings.type === type ? { backgroundColor: `${color}22` } : undefined}
          >
            {INSTRUMENT_LABELS[type]}
          </button>
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-[var(--color-text-dim)]">{INSTRUMENT_DESCRIPTIONS[settings.type]}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {(settings.type === 'analog' || settings.type === 'fm' || settings.type === 'am') && (
          <div className="flex flex-wrap gap-2">
            {WAVEFORMS.map((wf) => (
              <button
                key={wf}
                onClick={() => setParam('waveform', wf)}
                className={`rounded-full border px-2.5 py-1 text-xs capitalize ${
                  params.waveform === wf ? 'border-[var(--color-text-bright)] text-[var(--color-text-bright)]' : 'border-[var(--color-border)] text-[var(--color-text-dim)]'
                }`}
              >
                {wf}
              </button>
            ))}
          </div>
        )}

        {(settings.type === 'fm' || settings.type === 'am') && (
          <Slider label="Harmonicity" value={Number(params.harmonicity)} min={0.5} max={8} onChange={(v) => setParam('harmonicity', v)} />
        )}
        {settings.type === 'fm' && (
          <Slider label="Modulation Index" value={Number(params.modulationIndex)} min={0} max={50} step={0.5} onChange={(v) => setParam('modulationIndex', v)} />
        )}

        {settings.type === 'duo' && (
          <>
            <Slider label="Harmonicity" value={Number(params.harmonicity)} min={0.25} max={4} onChange={(v) => setParam('harmonicity', v)} />
            <Slider label="Vibrato Amount" value={Number(params.vibratoAmount)} min={0} max={1} onChange={(v) => setParam('vibratoAmount', v)} />
            <Slider label="Vibrato Rate" value={Number(params.vibratoRate)} min={0.5} max={12} step={0.1} onChange={(v) => setParam('vibratoRate', v)} />
          </>
        )}

        {settings.type === 'pluck' && (
          <>
            <Slider label="Attack Noise" value={Number(params.attackNoise)} min={0.1} max={20} step={0.1} onChange={(v) => setParam('attackNoise', v)} />
            <Slider
              label="Dampening"
              value={Number(params.dampening)}
              min={100}
              max={7000}
              step={10}
              format={(v) => `${Math.round(v)} Hz`}
              onChange={(v) => setParam('dampening', v)}
            />
            <Slider label="Resonance" value={Number(params.resonance)} min={0} max={0.99} onChange={(v) => setParam('resonance', v)} />
          </>
        )}
      </div>
    </div>
  )
}
