"use server";

import prisma from "@/lib/prisma"
import { Store } from "@prisma/client";

export async function getStores(): Promise<Store[]> {
  try {
    return await prisma.store.findMany({ include: { products: true, sales: true } })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}
