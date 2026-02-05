"use server";

import prisma from "@/lib/prisma"
import { Sale } from "@prisma/client";

export async function getAllSales(): Promise<Sale[]> {
  try {
    return await prisma.sale.findMany({ include: { items: true } })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}
