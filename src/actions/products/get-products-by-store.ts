"use server";

import { products } from '@/data';
import prisma from "@/lib/prisma"
import { Product } from '@prisma/client';

export async function GetProductsByStore(storeId:number): Promise<Product[]> {

  const allProducts = await prisma.product.findMany({
    where: {
      storeId: storeId
    }
  })

  return allProducts.filter(product=> product.storeId == storeId);
}
