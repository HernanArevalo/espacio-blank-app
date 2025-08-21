import { Product } from "./product.interface"

export interface Store {
  id: number
  name: string
  description: string|null
  image?: string
  discounts: {
    tarjeta: number
    transferencia: number
    efectivo: number
  },
  products: Product[]
}

