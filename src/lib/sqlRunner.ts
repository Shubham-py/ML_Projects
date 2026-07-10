import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'

const SQLJS_CDN = 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/'

let sqlJsPromise: Promise<SqlJsStatic> | null = null

function getSqlJs(): Promise<SqlJsStatic> {
  const existing: Promise<SqlJsStatic> | null = sqlJsPromise
  if (existing) return existing
  const created = initSqlJs({ locateFile: (file: string) => `${SQLJS_CDN}${file}` })
  sqlJsPromise = created
  return created
}

export async function createDatabase(setupSql: string): Promise<Database> {
  const SQL = await getSqlJs()
  const db = new SQL.Database()
  db.run(setupSql)
  return db
}

export interface QueryResult {
  columns: string[]
  rows: unknown[][]
  error: string | null
}

export function runQuery(db: Database, query: string): QueryResult {
  try {
    const results = db.exec(query)
    if (results.length === 0) {
      return { columns: [], rows: [], error: null }
    }
    const { columns, values } = results[0]
    return { columns, rows: values, error: null }
  } catch (err) {
    return { columns: [], rows: [], error: err instanceof Error ? err.message : String(err) }
  }
}
