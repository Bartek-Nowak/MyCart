import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { initSQLite, selectAll, insertRow, deleteRow, selectWhere } from '@/db/sqlite'
import { TABLES } from '@/db/tables'
import type { SQLiteDBConnection } from '@capacitor-community/sqlite'
import type { List, Product } from '@/types/db'

const DB_LISTS = 'mylistdb'

export const useListsStore = defineStore('lists', () => {
  let db: SQLiteDBConnection

  const lists = reactive<List[]>([])

  const initDB = async () => {
    try {
      const result = await initSQLite(DB_LISTS, [TABLES.LISTS.sql, TABLES.PRODUCTS.sql])
      if (!result) {
        console.warn('DB not initialized, skipping lists store initialization')
        return
      }
      db = result
      await loadLists()
    } catch (e) {
      console.error('Failed to initialize DB', e)
    }
  }

  const loadLists = async () => {
    if (!db) return
    try {
      const res: List[] = await selectAll(db, 'LISTS')
      lists.splice(0, lists.length, ...res)

      for (const list of lists) {
        const productsRes: Product[] = await selectWhere(db, 'PRODUCTS', { listId: list.id })
        list.products = productsRes.map((p) => ({ ...p, checked: !!p.checked }))
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
      const newList: List = { id, name: list.name, color: list.color, items: 0, products: [] }
      await insertRow(db, 'LISTS', [id, list.name, list.color, 0])
      lists.push(newList)
    } catch (e) {
      console.error('Failed to add list', e)
    }
  }

  const deleteList = async (id: string) => {
    if (!db) return
    try {
      await deleteRow(db, 'PRODUCTS', 'listId', id)
      await deleteRow(db, 'LISTS', 'id', id)
      const index = lists.findIndex((l) => l.id === id)
      if (index !== -1) lists.splice(index, 1)
    } catch (e) {
      console.error('Failed to delete list', e)
    }
  }

  const addProduct = async (
    listId: string,
    product: { name: string; quantity: string; checked?: boolean },
  ) => {
    if (!db) return
    try {
      const id = uuidv4()
      const checkedValue = product.checked ? 1 : 0
      const newProduct: Product = {
        id,
        listId,
        name: product.name,
        quantity: product.quantity,
        checked: product.checked ?? false,
      }

      await insertRow(db, 'PRODUCTS', [id, listId, product.name, product.quantity, checkedValue])

      const list = lists.find((l) => l.id === listId)
      if (list) {
        list.products.push(newProduct)
        list.items = list.products.length
      }
    } catch (e) {
      console.error('Failed to add product', e)
    }
  }

  const deleteProduct = async (listId: string, productId: string) => {
    if (!db) return
    try {
      await deleteRow(db, 'PRODUCTS', 'id', productId)
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
