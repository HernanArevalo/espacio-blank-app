'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export const deleteProductById = async (id: number) => {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/tiendas/id');
    revalidatePath('/admin/tiendas/id');

    return { ok: true, message: 'Producto eliminada correctamente' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { ok: false, message: 'No se pudo eliminar el producto' };
  }
}
