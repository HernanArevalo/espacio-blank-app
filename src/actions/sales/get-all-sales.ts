"use server";

import { Sale } from "@/interfaces"
import prisma from "@/lib/prisma"

export async function getAllSales(): Promise<Sale[]> {
  try {
    return await prisma.sale.findMany({ include: { items: true } })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}
