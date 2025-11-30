'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Configuración de Cloudinary (Asegúrate de tener CLOUDINARY_URL en tu .env)
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

// Esquema de validación adaptado a tu modelo Product
const productSchema = z.object({
  id: z.coerce.number().optional(), // Puede no venir si es creación
  name: z.string().min(3).max(255),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0), // Coerce convierte el string del form a number
  stock: z.coerce.number().min(0).int(), // Stock debe ser entero
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
    // 1. Manejo de la imagen (Si viene un archivo nuevo)
    const imageFile = formData.get('image')
    let imageUrl: string | null = null

    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile)
      if (!imageUrl) {
        return { ok: false, message: 'No se pudo subir la imagen' }
      }
    }

    // 2. Preparar el objeto final para guardar en DB
    // Si hay nueva imagen, la agregamos. Si no, dejamos que Prisma mantenga la anterior (en update)
    const dataToSave = {
      ...productData,
      ...(imageUrl && { image: imageUrl }), // Solo agrega la propiedad si hay URL
    }

    let product;

    // 3. Transacción o llamada a Prisma
    if (id) {
      // --- ACTUALIZAR ---
      product = await prisma.product.update({
        where: { id },
        data: dataToSave,
      })
    } else {
      // --- CREAR ---
      product = await prisma.product.create({
        data: dataToSave,
      })
    }

    // 4. Revalidar rutas para refrescar la UI (Adaptado a tus rutas)
    revalidatePath(`/tienda/${product.storeId}`)
    revalidatePath(`/tienda/${product.storeId}/productos`) 
    revalidatePath(`/admin/tiendas/${product.storeId}`)
    
    return { ok: true, product }

  } catch (error) {
    console.error('❌ Error en createUpdateProduct:', error)
    return { ok: false, message: 'Error interno al guardar el producto' }
  }
}

// Función auxiliar para subir a Cloudinary
const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Subida como data URI
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`,
      { folder: 'espacio-blank' } // Opcional: carpeta en cloudinary
    )

    return upload.secure_url
  } catch (error) {
    console.error('❌ Error subiendo imagen a Cloudinary:', error)
    return null
  }
}