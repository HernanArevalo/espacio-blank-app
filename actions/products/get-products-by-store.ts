import { products } from '@/data';
import { Product } from '@/interfaces';

export function GetProductsByStore(storeId:number): Product[] {
  const allProducts = products

  return allProducts.filter(product=> product.storeId == storeId);
}
