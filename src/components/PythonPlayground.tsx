import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { runPython, isPyodideReady } from '../lib/pyodideRunner'

const editorTheme = {
  '&': { backgroundColor: 'var(--color-bg-soft)', fontSize: '13px' },
  '.cm-content': { fontFamily: 'var(--font-mono)', caretColor: '#fff' },
  '.cm-gutters': { backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-text-dim)', border: 'none' },
}

export default function PythonPlayground({
  starterCode,
  solutionCode,
}: {
  starterCode: string
  solutionCode?: string
}) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [loadingRuntime, setLoadingRuntime] = useState(false)

  const onRun = async () => {
    setRunning(true)
    setLoadingRuntime(!isPyodideReady())
    setOutput(null)
    setError(null)
    try {
      const result = await runPython(code)
      setOutput(result.stdout)
      setError(result.error)
    } finally {
      setRunning(false)
      setLoadingRuntime(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between bg-[var(--color-bg-soft)] px-3 py-1.5 border-b border-[var(--color-border)]">
          <span className="text-xs font-mono text-[var(--color-text-dim)]">python (numpy + pandas + scikit-learn available)</span>
          <div className="flex gap-2">
            {solutionCode && (
              <button
                onClick={() => setCode(solutionCode)}
                className="text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
              >
                Load Solution
              </button>
            )}
            <button
              onClick={() => setCode(starterCode)}
              className="text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
            >
              Reset
            </button>
          </div>
        </div>
        <CodeMirror
          value={code}
          height="auto"
          minHeight="200px"
          maxHeight="500px"
          theme="dark"
          extensions={[python()]}
          onChange={(value) => setCode(value)}
          style={editorTheme as never}
        />
      </div>

      <button
        onClick={onRun}
        disabled={running}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#0b0d12] hover:opacity-90 disabled:opacity-60"
      >
        {running ? (loadingRuntime ? 'Loading Python runtime (first run only, ~20-30s)…' : 'Running…') : '▶ Run Code'}
      </button>

      {(output !== null || error) && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] p-4 font-mono text-xs">
          {output && <pre className="whitespace-pre-wrap text-[var(--color-text)]">{output}</pre>}
          {error && <pre className="whitespace-pre-wrap text-[var(--color-danger)]">{error}</pre>}
          {!output && !error && <span className="text-[var(--color-text-dim)]">(no output)</span>}
        </div>
      )}
    </div>
  )
}
