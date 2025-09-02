import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'

const DB_LISTS = 'mylistdb'

export const useListsStore = defineStore('lists', () => {
  let sqlite: SQLiteConnection
  let db: SQLiteDBConnection

  const lists = reactive<
    { id: string; name: string; color: string; items: number; products: any[] }[]
  >([])

  const initDB = async () => {
    if (Capacitor.getPlatform() !== 'android') {
      console.log('Not running on Android, skipping SQLite initialization')
      return
    }

    try {
      sqlite = new SQLiteConnection(CapacitorSQLite)
      db = await sqlite.createConnection(DB_LISTS, false, 'no-encryption', 1, false)
      await db.open()

      await db.execute(`
        CREATE TABLE IF NOT EXISTS lists (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT,
          items INTEGER
        );
      `)

      await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          listId TEXT NOT NULL,
          name TEXT NOT NULL,
          quantity TEXT
        );
      `)

      await loadLists()
      console.log('Database initialized successfully on Android')
    } catch (e) {
      console.error('DB init error', e)
    }
  }

  const loadLists = async () => {
    if (!db) return
    try {
      const res: any = await db.query('SELECT * FROM lists;')
      lists.splice(0, lists.length, ...(res.values ?? []))

      for (const list of lists) {
        const productsRes: any = await db.query('SELECT * FROM products WHERE listId = ?;', [
          list.id,
        ])
        list.products = productsRes.values ?? []
        list.items = list.products.length
      }
    } catch (e) {
      console.error('Failed to load lists or products', e)
    }
  }

  const addList = async (list: { name: string; color: string }) => {
    if (!db) return
    try {
      const id = uuidv4()
      await db.run('INSERT INTO lists (id, name, color, items) VALUES (?, ?, ?, ?);', [
        id,
        list.name,
        list.color,
        0,
      ])
      lists.push({ id, name: list.name, color: list.color, items: 0, products: [] })
    } catch (e) {
      console.error('Failed to add list', e)
    }
  }

  const deleteList = async (id: string) => {
    if (!db) return
    try {
      await db.run('DELETE FROM products WHERE listId = ?;', [id])
      await db.run('DELETE FROM lists WHERE id = ?;', [id])
      const index = lists.findIndex((l) => l.id === id)
      if (index !== -1) lists.splice(index, 1)
    } catch (e) {
      console.error('Failed to delete list', e)
    }
  }

  const addProduct = async (listId: string, product: { name: string; quantity: string }) => {
    if (!db) return
    try {
      const id = uuidv4()
      await db.run('INSERT INTO products (id, listId, name, quantity) VALUES (?, ?, ?, ?);', [
        id,
        listId,
        product.name,
        product.quantity,
      ])
      const list = lists.find((l) => l.id === listId)
      if (list) {
        list.products.push({ id, ...product })
        list.items = list.products.length
      }
    } catch (e) {
      console.error('Failed to add product', e)
    }
  }

  const deleteProduct = async (listId: string, productId: string) => {
    if (!db) return
    try {
      await db.run('DELETE FROM products WHERE id = ?;', [productId])
      const list = lists.find((l) => l.id === listId)
      if (list) {
        const index = list.products.findIndex((p) => p.id === productId)
        if (index !== -1) list.products.splice(index, 1)
        list.items = list.products.length
      }
    } catch (e) {
      console.error('Failed to delete product', e)
    }
  }

  return { lists, initDB, loadLists, addList, deleteList, addProduct, deleteProduct }
})
