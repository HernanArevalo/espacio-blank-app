"use server";

import { Store } from "@/interfaces"
import prisma from "@/lib/prisma"

export async function getStoreById(storeId:number): Promise<Store|null> {
  try {
    const store = await prisma.store.findFirst({ 
      include: { 
        products: true, 
        sales: { include: { items: true }}
       },
      where: { id: storeId }
    
    })

    if (!store) {
      return null
    }
    return store
  } catch (error) {
    console.error('Error fetching store:', error)
    return null
  }
}
