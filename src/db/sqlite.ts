import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import { TABLES } from './tables'

let sqlite: SQLiteConnection
let dbInstances: Record<string, SQLiteDBConnection> = {}

export const initSQLite = async (
  db_name: string,
  tables: string[],
): Promise<SQLiteDBConnection | undefined> => {
  const isWeb = Capacitor.getPlatform() === 'web'

  if (isWeb) {
    if (dbInstances[db_name]) return dbInstances[db_name]

    const mockDB: any = {
      _data: {} as Record<string, any[]>,
      query: async (query: string, values: any[] = []) => {
        const table = query.match(/FROM (\w+)/i)?.[1]
        if (!table) return { values: [] }

        let rows: Record<string, any>[] = mockDB._data[table.toUpperCase()] || []

        const whereMatch = query.match(/WHERE (.+);?$/i)
        if (whereMatch) {
          const conditions = whereMatch[1].split('AND').map((c) => c.trim())
          rows = rows.filter((row: Record<string, any>) =>
            conditions.every((cond, i) => {
              const col = cond.split('=')[0].trim()
              return row[col] === values[i]
            }),
          )
        }

        return { values: rows }
      },
      run: async (query: string, values: any[] = []) => {
        const insertMatch = query.match(/INTO (\w+) \(([^)]+)\)/i)
        const updateMatch = query.match(/UPDATE (\w+) SET (.+) WHERE (.+);/i)
        const deleteMatch = query.match(/DELETE FROM (\w+) WHERE (.+);/i)

        // INSERT
        if (insertMatch) {
          const table = insertMatch[1]
          const cols = insertMatch[2].split(',').map((c) => c.trim())
          if (!mockDB._data[table.toUpperCase()]) mockDB._data[table.toUpperCase()] = []

          const row: Record<string, any> = {}
          cols.forEach((col, i) => (row[col] = values[i]))
          mockDB._data[table.toUpperCase()].push(row)
          return
        }

        // UPDATE
        if (updateMatch) {
          const table = updateMatch[1].toUpperCase()
          const setParts = updateMatch[2].split(',').map((p) => p.trim())
          const whereParts = updateMatch[3].split('AND').map((p) => p.trim())

          const rows: Record<string, any>[] = mockDB._data[table] || []
          rows.forEach((row: Record<string, any>) => {
            let match = true
            whereParts.forEach((cond, i) => {
              const col = cond.split('=')[0].trim()
              if (row[col] !== values[setParts.length + i]) match = false
            })
            if (match) {
              setParts.forEach((set, i) => {
                const col = set.split('=')[0].trim()
                row[col] = values[i]
              })
            }
          })
          return
        }

        // DELETE
        if (deleteMatch) {
          const table = deleteMatch[1].toUpperCase()
          const col = deleteMatch[2].split('=')[0].trim()
          const val = values[0]
          mockDB._data[table] = (mockDB._data[table] || []).filter(
            (row: Record<string, any>) => row[col] !== val,
          )
          return
        }
      },
    }

    dbInstances[db_name] = mockDB
    console.log('Web SQLite mock initialized')
    return mockDB
  }

  // Android / iOS
  if (dbInstances[db_name]) return dbInstances[db_name]

  try {
    if (!sqlite) sqlite = new SQLiteConnection(CapacitorSQLite)
    const db = await sqlite.createConnection(db_name, false, 'no-encryption', 1, false)
    await db.open()

    for (const table of tables) {
      await db.execute(table)
    }

    dbInstances[db_name] = db
    console.log('Database initialized successfully on Android')
    return db
  } catch (e) {
    console.error('DB init error', e)
    throw e
  }
}

export const selectWhere = async <T extends keyof typeof TABLES>(
  db: SQLiteDBConnection,
  table: T,
  where?: Partial<Record<(typeof TABLES)[T]['columns'][number], any>>,
) => {
  let query = `SELECT * FROM ${table.toLowerCase()}`
  const values: any[] = []

  if (where && Object.keys(where).length > 0) {
    const conditions = Object.entries(where).map(([key, val]) => {
      values.push(val)
      return `${key} = ?`
    })
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ';'
  const res: any = await db.query(query, values)
  return res.values ?? []
}

export const selectAll = async <T extends keyof typeof TABLES>(db: SQLiteDBConnection, table: T) =>
  selectWhere(db, table)

export const insertRow = async <T extends keyof typeof TABLES>(
  db: SQLiteDBConnection,
  table: T,
  values: any[],
) => {
  const cols = TABLES[table].columns.join(', ')
  const placeholders = TABLES[table].columns.map(() => '?').join(', ')
  const query = `INSERT INTO ${table.toLowerCase()} (${cols}) VALUES (${placeholders});`
  await db.run(query, values)
}

export const deleteRow = async <T extends keyof typeof TABLES>(
  db: SQLiteDBConnection,
  table: T,
  column: string,
  value: any,
) => {
  const query = `DELETE FROM ${table.toLowerCase()} WHERE ${column} = ?;`
  await db.run(query, [value])
}

export const updateRow = async <T extends keyof typeof TABLES>(
  db: SQLiteDBConnection,
  table: T,
  updates: Partial<Record<(typeof TABLES)[T]['columns'][number], any>>,
  where: Partial<Record<(typeof TABLES)[T]['columns'][number], any>>,
) => {
  if (!updates || Object.keys(updates).length === 0) return

  const setParts: string[] = []
  const values: any[] = []

  for (const [col, val] of Object.entries(updates)) {
    setParts.push(`${col} = ?`)
    values.push(val)
  }

  const whereParts: string[] = []
  for (const [col, val] of Object.entries(where)) {
    whereParts.push(`${col} = ?`)
    values.push(val)
  }

  const query = `UPDATE ${table.toLowerCase()} SET ${setParts.join(', ')} WHERE ${whereParts.join(' AND ')};`
  await db.run(query, values)
}
