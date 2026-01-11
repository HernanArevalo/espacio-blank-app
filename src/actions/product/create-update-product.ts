'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3).max(255),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0).int(),
  storeId: z.coerce.number().int(),
})

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = productSchema.safeParse(data)

  if (!parsed.success) {
    console.error("Errores de validación:", parsed.error)
    return { ok: false, message: 'Datos inválidos: Revise los campos' }
  }

  const { id, ...productData } = parsed.data

  try {
    const imageFile = formData.get('image')
    let imageUrl: string | null = null

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile)
      if (!imageUrl) {
        return { ok: false, message: 'No se pudo subir la imagen' }
      }
    }

    const dataToSave = {
      ...productData,
      ...(imageUrl && { image: imageUrl }), // Solo agrega la propiedad si hay URL
    }

    let product;

    if (id) {
      product = await prisma.product.update({
        where: { id },
        data: dataToSave,
      })
    } else {
      product = await prisma.product.create({
        data: dataToSave,
      })
    }

    revalidatePath(`/tiendas/${product.storeId}`)
    revalidatePath(`/tiendas/${product.storeId}/productos`) 
    revalidatePath(`/admin/tiendas/${product.storeId}`)
    
    return { ok: true, product }

  } catch (error) {
    console.error('❌ Error en createUpdateProduct:', error)
    return { ok: false, message: 'Error interno al guardar el producto' }
  }
}

const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    // Subida como data URI
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      { folder: 'espacio-blank' }
    )

    return upload.secure_url
  } catch (error) {
    console.error('❌ Error subiendo imagen a Cloudinary:', error)
    return null
  }
}