import { useState } from 'react'
import { audioEngine } from '../lib/audioEngine'

interface EffectsRackProps {
  reverbWet: number
  onReverbChange: (wet: number) => void
  delayWet: number
  onDelayChange: (wet: number) => void
  sidechainAmount: number
  onSidechainAmountChange: (amount: number) => void
  sidechainEnabled: boolean
  onSidechainEnabledChange: (enabled: boolean) => void
}

function Knob({ label, value, min, max, step = 0.01, onChange, format }: {
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
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-[var(--color-neon-cyan)]"
      />
    </label>
  )
}

export default function EffectsRack({
  reverbWet,
  onReverbChange,
  delayWet,
  onDelayChange,
  sidechainAmount,
  onSidechainAmountChange,
  sidechainEnabled,
  onSidechainEnabledChange,
}: EffectsRackProps) {
  const [masterFilter, setMasterFilter] = useState(20000)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-neon-cyan)]">Master Bus</h3>
        <Knob label="Reverb" value={reverbWet} min={0} max={1} onChange={(v) => { onReverbChange(v); audioEngine.setReverbWet(v) }} />
        <Knob label="Delay" value={delayWet} min={0} max={1} onChange={(v) => { onDelayChange(v); audioEngine.setDelayWet(v) }} />
        <Knob
          label="Master Filter (build-up sweep)"
          value={masterFilter}
          min={200}
          max={20000}
          step={10}
          format={(v) => `${Math.round(v)} Hz`}
          onChange={(v) => {
            setMasterFilter(v)
            audioEngine.setMasterFilterCutoff(v)
          }}
        />
        <p className="text-[11px] text-[var(--color-text-dim)]">
          Try sweeping the master filter down during a build-up, then snapping it back to 20000 Hz right as the drop hits.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-neon-pink)]">Sidechain Pump</h3>
        <label className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
          <input
            type="checkbox"
            checked={sidechainEnabled}
            onChange={(e) => {
              onSidechainEnabledChange(e.target.checked)
              audioEngine.setSidechainEnabled(e.target.checked)
            }}
            className="accent-[var(--color-neon-pink)]"
          />
          Duck the mix on every kick (classic EDM "pump")
        </label>
        <Knob
          label="Pump depth"
          value={sidechainAmount}
          min={0}
          max={1}
          onChange={(v) => {
            onSidechainAmountChange(v)
            audioEngine.setSidechainAmount(v)
          }}
        />
        <p className="text-[11px] text-[var(--color-text-dim)]">
          Bass and Lead instrument settings (including filter cutoff and wobble) now live on their own tabs, right next to
          the piano roll you use to write their parts.
        </p>
      </div>
    </div>
  )
}
