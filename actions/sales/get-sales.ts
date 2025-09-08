import { sales } from "@/data";


export function getSales (storeId:number) {

  return sales.filter(sale=> sale.storeId == storeId) || null
}