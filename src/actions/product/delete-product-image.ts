"use server";

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (
  imageId: number,
  imageUrl: string
): Promise<{ ok: boolean; message?: string }> => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      message: 'Invalid image URL. Cannot delete from FS',
    };
  }

  // Obtener el "public_id" que Cloudinary necesita para borrar
  const imageName =
    imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    // Borrar en Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(imageName);

    if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
      return {
        ok: false,
        message: 'Cloudinary deletion failed',
      };
    }

    // Borrar en Prisma
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Revalidar rutas relacionadas
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/product/${deletedImage.product.slug}`);

    return {
      ok: true,
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      ok: false,
      message: 'Unexpected error while deleting image',
    };
  }
};
