import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useListsStore = defineStore('lists', () => {
  const lists = reactive([
    {
      id: uuidv4(),
      name: 'Weekly Groceries',
      color: 'border-green-500',
      items: 3,
      products: [
        { id: uuidv4(), name: 'Milk', quantity: '1 L' },
        { id: uuidv4(), name: 'Bread', quantity: '2 pcs' },
        { id: uuidv4(), name: 'Eggs', quantity: '12 pcs' },
      ],
    },
    { id: uuidv4(), name: 'Party Supplies', color: 'border-orange-400', items: 0, products: [] },
    { id: uuidv4(), name: 'Office Snacks', color: 'border-blue-400', items: 0, products: [] },
  ])

  const addList = (list: { name: string; color: string }) => {
    lists.push({
      id: uuidv4(),
      name: list.name,
      items: 0,
      color: list.color,
      products: [],
    })
  }

  const deleteList = (id: string) => {
    const index = lists.findIndex((list) => list.id === id)
    if (index !== -1) lists.splice(index, 1)
  }

  const addProduct = (listId: string, product: { name: string; quantity: string }) => {
    const list = lists.find((l) => l.id === listId)
    if (list) {
      list.products.push({ id: uuidv4(), ...product })
      list.items = list.products.length
    }
  }

  const deleteProduct = (listId: string, productId: string) => {
    const list = lists.find((l) => l.id === listId)
    if (list) {
      const index = list.products.findIndex((p) => p.id === productId)
      if (index !== -1) list.products.splice(index, 1)
      list.items = list.products.length
    }
  }

  return { lists, addList, deleteList, addProduct, deleteProduct }
})
