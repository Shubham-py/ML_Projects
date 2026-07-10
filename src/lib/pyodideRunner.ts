const PYODIDE_VERSION = '0.26.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (pkgs: string | string[]) => Promise<void>
  setStdout: (opts: { batched: (s: string) => void }) => void
  setStderr: (opts: { batched: (s: string) => void }) => void
}

let pyodidePromise: Promise<PyodideInterface> | null = null
let scriptPromise: Promise<void> | null = null
let ready = false

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve()
    const script = document.createElement('script')
    script.src = `${PYODIDE_CDN}pyodide.js`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = (async () => {
    await loadScript()
    if (!window.loadPyodide) throw new Error('Pyodide failed to attach to window')
    const pyodide = await window.loadPyodide({ indexURL: PYODIDE_CDN })
    await pyodide.loadPackage(['numpy', 'pandas', 'scikit-learn'])
    ready = true
    return pyodide
  })()
  return pyodidePromise
}

export interface RunResult {
  stdout: string
  error: string | null
}

export async function runPython(code: string): Promise<RunResult> {
  const pyodide = await getPyodide()
  let output = ''
  pyodide.setStdout({ batched: (s: string) => (output += s + '\n') })
  pyodide.setStderr({ batched: (s: string) => (output += s + '\n') })
  try {
    await pyodide.runPythonAsync(code)
    return { stdout: output, error: null }
  } catch (err) {
    return { stdout: output, error: err instanceof Error ? err.message : String(err) }
  }
}

export function isPyodideReady(): boolean {
  return ready
}
