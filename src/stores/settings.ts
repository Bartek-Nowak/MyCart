import { reactive } from 'vue'
import { initSQLite, insertRow, selectAll, updateRow } from '@/db/sqlite'
import { TABLES } from '@/db/tables'
import type { SQLiteDBConnection } from '@capacitor-community/sqlite'
import type { Setting } from '@/types/db'

const DB_SETTINGS = 'settingsdb'

const DEFAULT_SETTINGS = [
  { name: 'theme', value: 'dark', type: 'string' },
  { name: 'language', value: 'en', type: 'string' },
]

export const useSettingsStore = () => {
  let db: SQLiteDBConnection

  const settings = reactive<Setting[]>([])

  const initDB = async () => {
    try {
      const result = await initSQLite(DB_SETTINGS, [TABLES.SETTINGS.sql])
      if (!result) {
        console.warn('DB not initialized, skipping lists store initialization')
        return
      }
      db = result

      await loadDefaultSettings(DEFAULT_SETTINGS)
    } catch (e) {
      console.error('Failed to initialize DB', e)
    }
  }

  const loadDefaultSettings = async (defaults: { name: string; value: string; type: string }[]) => {
    if (!db) return

    try {
      const rows = await selectAll(db, 'SETTINGS')

      if (rows.length === 0) {
        for (const s of defaults) {
          await insertRow(db, 'SETTINGS', [crypto.randomUUID(), s.name, s.value])
          settings.push({ id: crypto.randomUUID(), ...s })
        }
        console.log('Default settings loaded')
      } else {
        rows.forEach((r: any) => {
          settings.push({ id: r.id, name: r.key, value: r.value, type: 'string' })
        })
      }
    } catch (e) {
      console.error('Failed to load default settings', e)
    }
  }

  const updateSetting = async (name: string, value: string) => {
    if (!db) return
    try {
      await updateRow(db, 'SETTINGS', { value }, { key: name })

      const setting = settings.find((s) => s.name === name)
      if (setting) {
        setting.value = value
      } else {
        settings.push({ id: crypto.randomUUID(), name, value, type: 'string' })
      }
    } catch (e) {
      console.error('Failed to update setting', e)
    }
  }

  return {
    initDB,
    settings,
    updateSetting,
  }
}
