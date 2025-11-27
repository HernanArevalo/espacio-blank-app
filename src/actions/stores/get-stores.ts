"use server";

import { Store } from "@/interfaces"
import prisma from "@/lib/prisma"

export async function getStores(): Promise<Store[]> {
  try {
    return await prisma.store.findMany({ include: { products: true, sales: true } })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}
