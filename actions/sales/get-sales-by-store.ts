import { sales } from "@/data";


export function getAllSales (storeId:number) {

  return sales.filter(sale=> sale.storeId == storeId) || null
}