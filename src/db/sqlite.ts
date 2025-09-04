import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import { TABLES } from './tables'

let sqlite: SQLiteConnection
let dbInstances: Record<string, SQLiteDBConnection> = {}

export const initSQLite = async (
  db_name: string,
  tables: string[],
): Promise<SQLiteDBConnection | undefined> => {
  if (Capacitor.getPlatform() !== 'android') {
    console.log('Not running on Android, skipping SQLite initialization')
    return
  }

  if (dbInstances[db_name]) {
    return dbInstances[db_name]
  }

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

export const selectAll = async <T extends keyof typeof TABLES>(
  db: SQLiteDBConnection,
  table: T,
) => {
  return selectWhere(db, table)
}

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
