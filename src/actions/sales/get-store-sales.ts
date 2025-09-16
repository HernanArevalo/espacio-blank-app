import { sales } from "@/data";


export function getStoreSales (storeId:number) {

  return sales.filter(sale=> sale.storeId == storeId) || null
}