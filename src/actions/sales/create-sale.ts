'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PaymentMethod } from '@prisma/client'; // Importamos el Enum de tu schema
import { SaleItem } from '@/interfaces';

export async function createSale(
  storeId: number,
  items: SaleItem[],
  total: number,
  paymentMethod: PaymentMethod,
  clientName?: string | null
) {
  try {
    const sale = await prisma.$transaction(async (tx) => {
      
      // 1. Validar Stock y Recopilar datos para SaleItem
      // Necesitamos el nombre e imagen actual del producto para guardarlo en el historial
      const saleItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true, image: true }
        });

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para: ${product.name}. Stock actual: ${product.stock}`);
        }

        // Descontar stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        // Preparamos el item para guardarlo con su "foto" actual de datos
        saleItemsData.push({
          productId: item.productId, // Relación opcional con Product [cite: 10]
          name: product.name,        // Obligatorio en SaleItem 
          price: item.price,
          quantity: item.quantity,
          image: product.image       // Opcional en SaleItem [cite: 9]
        });
      }

      // 2. Crear la Venta
      const newSale = await tx.sale.create({
        data: {
          storeId: storeId,
          total: total,
          paymentMethod: paymentMethod, // Obligatorio [cite: 7]
          client: clientName?.trim() == ""? null : clientName?.trim(),
          items: {
            create: saleItemsData
          }
        }
      });

      return newSale;
    });

    // 3. Revalidar rutas
    revalidatePath(`/admin/tiendas/${storeId}`);
    revalidatePath(`/tienda/${storeId}`);
    
    return { ok: true, sale: sale };

  } catch (error: any) {
    console.error(error);
    return { ok: false, message: error.message || 'Error al procesar la venta' };
  }
}