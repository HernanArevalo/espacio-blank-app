"use server";

import { Product } from "@/interfaces"
import prisma from "@/lib/prisma"

export async function getProductById(productId:number): Promise<Product|null> {
  try {
    const product = await prisma.product.findFirst({ 
      where: { id: productId }
    
    })

    if (!product) {
      return null
    }
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
