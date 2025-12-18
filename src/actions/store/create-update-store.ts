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
  stock: z.coerce.number().int().min(0),
  storeId: z.coerce.number().int(),
})

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = productSchema.safeParse(data)

  if (!parsed.success) {
    console.error("Errores de validación Zod:", parsed.error)
    return { ok: false, message: 'Datos inválidos: Revisa los campos numéricos' }
  }

  const { id, ...productData } = parsed.data

  try {
    const imageFile = formData.get('image')
    let imageUrl: string | null = null

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile)
      if (!imageUrl) {
        return { ok: false, message: 'No se pudo subir la imagen a la nube' }
      }
    }

    // Preparar datos. Si hay URL nueva, la asignamos.
    const dataToSave = {
      ...productData,
      ...(imageUrl && { image: imageUrl }),
    }

    let product

    const prismaTx = await prisma.$transaction(async (tx) => {
      if (id) {
        // --- ACTUALIZAR (UPDATE) ---
        // Verificamos que exista primero para evitar errores raros
        const exists = await tx.product.findUnique({ where: { id } })
        if (!exists) throw new Error(`Producto con ID ${id} no encontrado`)

        return await tx.product.update({
          where: { id },
          data: dataToSave,
        })
      } else {
        // --- CREAR (CREATE) ---
        return await tx.product.create({
          data: dataToSave,
        })
      }
    })

    // 3. Revalidar rutas
    revalidatePath(`/tiendas/${productData.storeId}`)
    revalidatePath(`/tiendas/${productData.storeId}/productos`)
    revalidatePath(`/admin/tiendas/${productData.storeId}`)

    return { ok: true, product: prismaTx }

  } catch (error) {
    console.error('❌ Error en createUpdateProduct:', error)
    return { ok: false, message: 'Error interno al guardar el producto' }
  }
}

const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      { folder: 'espacio-blank-app' } 
    )

    return upload.secure_url
  } catch (error) {
    console.error('❌ Error subiendo imagen a Cloudinary:', error)
    return null
  }
}