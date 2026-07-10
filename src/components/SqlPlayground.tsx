import { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import type { Database } from 'sql.js'
import { createDatabase, runQuery, type QueryResult } from '../lib/sqlRunner'

export default function SqlPlayground({
  setupSql,
  starterQuery,
  solutionQuery,
}: {
  setupSql: string
  starterQuery: string
  solutionQuery?: string
}) {
  const [query, setQuery] = useState(starterQuery)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [running, setRunning] = useState(false)
  const [dbReady, setDbReady] = useState(false)
  const dbRef = useRef<Database | null>(null)

  useEffect(() => {
    let cancelled = false
    setDbReady(false)
    createDatabase(setupSql).then((db) => {
      if (cancelled) return
      dbRef.current = db
      setDbReady(true)
    })
    return () => {
      cancelled = true
      dbRef.current?.close()
    }
  }, [setupSql])

  const onRun = () => {
    if (!dbRef.current) return
    setRunning(true)
    const res = runQuery(dbRef.current, query)
    setResult(res)
    setRunning(false)
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between bg-[var(--color-bg-soft)] px-3 py-1.5 border-b border-[var(--color-border)]">
          <span className="text-xs font-mono text-[var(--color-text-dim)]">sql (SQLite dialect)</span>
          <div className="flex gap-2">
            {solutionQuery && (
              <button
                onClick={() => setQuery(solutionQuery)}
                className="text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
              >
                Load Solution
              </button>
            )}
            <button
              onClick={() => setQuery(starterQuery)}
              className="text-xs font-medium text-[var(--color-text-dim)] hover:text-[var(--color-accent)]"
            >
              Reset
            </button>
          </div>
        </div>
        <CodeMirror
          value={query}
          height="auto"
          minHeight="120px"
          maxHeight="400px"
          theme="dark"
          extensions={[sql()]}
          onChange={(value) => setQuery(value)}
        />
      </div>

      <button
        onClick={onRun}
        disabled={running || !dbReady}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[#0b0d12] hover:opacity-90 disabled:opacity-60"
      >
        {!dbReady ? 'Loading SQL engine…' : running ? 'Running…' : '▶ Run Query'}
      </button>

      {result && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-soft)] overflow-auto">
          {result.error ? (
            <pre className="p-4 font-mono text-xs text-[var(--color-danger)] whitespace-pre-wrap">{result.error}</pre>
          ) : result.columns.length === 0 ? (
            <p className="p-4 text-xs text-[var(--color-text-dim)]">Query ran with no rows returned.</p>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr>
                  {result.columns.map((c) => (
                    <th key={c} className="border-b border-[var(--color-border)] px-3 py-2 text-left text-[var(--color-text-bright)]">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr key={i} className="odd:bg-[var(--color-bg-card)]">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 text-[var(--color-text)]">
                        {cell === null ? <span className="text-[var(--color-text-dim)]">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
