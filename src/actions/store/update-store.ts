'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

// Esquema de validación para Tienda
const storeSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(3),
  description: z.string().optional().nullable(),
  // Los descuentos vienen del input como número entero (0-100), los convertimos a factor decimal (0.0 - 1.0)
  // Ejemplo: Input 20 -> DB 0.8 (20% off significa que pagas el 80%) 
  // O si tu lógica es guardar el descuento directo (0.2), ajustamos la fórmula. 
  // Según tu comentario en schema: "0.9 = 10% off". Entonces la fórmula es: 1 - (valor / 100)
  discountEfectivo: z.coerce.number().min(0).max(100).transform(val => 1 - (val / 100)),
  discountTransferencia: z.coerce.number().min(0).max(100).transform(val => 1 - (val / 100)),
  discountTarjeta: z.coerce.number().min(0).max(100).transform(val => 1 - (val / 100)),
})

export const updateStore = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = storeSchema.safeParse(data)

  if (!parsed.success) {
    console.error("Validation error:", parsed.error)
    return { ok: false, message: 'Datos inválidos' }
  }

  const { id, ...storeData } = parsed.data

  try {
    // 1. Manejo de Imagen
    const imageFile = formData.get('image')
    let imageUrl: string | null = null

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile)
      if (!imageUrl) return { ok: false, message: 'Error al subir imagen' }
    }

    const dataToSave = {
      ...storeData,
      ...(imageUrl && { image: imageUrl }),
    }

    // 2. Actualizar en DB
    await prisma.store.update({
      where: { id },
      data: dataToSave,
    })

    // 3. Revalidar
    revalidatePath('/admin/tiendas')
    revalidatePath(`/admin/tiendas/${id}`)
    revalidatePath(`/tiendas/${id}`)
    
    return { ok: true, message: 'Tienda actualizada correctamente' }

  } catch (error) {
    console.error('Error updating store:', error)
    return { ok: false, message: 'Error interno al actualizar' }
  }
}

const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      { folder: 'tiendas-app/logos' }
    )
    return upload.secure_url
  } catch (error) {
    console.error('Cloudinary error:', error)
    return null
  }
}