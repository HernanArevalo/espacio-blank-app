
export interface Product {
  name: string,
  productId: number,
  description?: string,
  image: string | null,
  price: number,
  stock: number,
  storeId: number,
}