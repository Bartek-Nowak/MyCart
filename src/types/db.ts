export interface Product {
  id: string
  listId: string
  name: string
  quantity: string
  checked: boolean
}

export interface List {
  id: string
  name: string
  color: string
  items: number
  products: Product[]
}

export interface Setting {
  id: string
  name: string
  value: string
  type: string
}
