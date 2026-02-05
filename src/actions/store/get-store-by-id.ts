"use server";

import prisma from "@/lib/prisma"
import { StoreWithProductsAndSales } from "@/types/prisma.types";

export async function getStoreById(storeId:number): Promise<StoreWithProductsAndSales|null> {
  try {
    const store = await prisma.store.findFirst({ 
      include: { 
        products: true, 
        sales: { include: { items: true }}
       },
      where: { id: storeId }
    
    }) as StoreWithProductsAndSales

    if (!store) {
      return null
    }
    return store
  } catch (error) {
    console.error('Error fetching store:', error)
    return null
  }
}
