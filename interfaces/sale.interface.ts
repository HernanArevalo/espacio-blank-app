export interface SaleItem {
  name: string
  productId: number
  quantity: number
  price: number
  image?: string
}
export interface Sale {
  id: number
  storeId: number
  client?: string
  date: string
  total: number
  paymentMethod: "card" | "transfer" | "cash"
  items: SaleItem[]
}
