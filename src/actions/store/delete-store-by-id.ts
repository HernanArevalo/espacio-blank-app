'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export const deleteStoreById = async (id: number) => {
  try {
    await prisma.store.delete({
      where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/tiendas');
    revalidatePath('/');
    revalidatePath('/admin/tienda/id');

    return { ok: true, message: 'Tienda eliminada correctamente' };
  } catch (error) {
    console.error('Error deleting store:', error);
    return { ok: false, message: 'No se pudo eliminar la tienda' };
  }
}
