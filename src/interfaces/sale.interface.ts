export interface SaleItem {
  name: string
  productId: number
  quantity: number
  price: number
  image: string | null
}
export interface Sale {
  id: number
  storeId: number
  client: string | null
  date: Date
  total: number
  paymentMethod: string
  items?: SaleItem[] | null
}
