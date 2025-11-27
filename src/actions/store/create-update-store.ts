'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL ?? '')

const productSchema = z.object({
  id: z.coerce.number().optional().nullable(),
  name: z.string().min(3).max(255),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  discountTarjeta: z.coerce.number().min(0),
  discountTransferencia: z.coerce.number().min(0),
  discountEfectivo: z.coerce.number().min(0),
})

export const createUpdateStore = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = productSchema.safeParse(data)

  if (!parsed.success) {
    console.error(parsed.error)
    return { ok: false, message: 'Datos inválidos' }
  }

  const { id, ...rest } = parsed.data

  try {
    const result = await prisma.$transaction(async (tx) => {
      let product

      if (id) {
        product = await tx.product.update({
          where: { id },
          data: rest,
        })
      } else {
        product = await tx.product.create({
          data: rest,
        })
      }

      // Manejo de imagen
      const imageFile = formData.get('image')
      if (imageFile instanceof File && imageFile.size > 0) {
        const url = await uploadImage(imageFile)
        if (!url) throw new Error('Error subiendo imagen')

        product = await tx.product.update({
          where: { id: product.id },
          data: { image: url },
        })
      }

      return product
    })

    // 🔁 Revalidate todas las páginas que muestran productos
    revalidatePath(`/store/${rest.storeId}`)
    revalidatePath(`/admin/store/${rest.storeId}`)
    revalidatePath(`/admin/products`)

    return { ok: true, product: result }
  } catch (error) {
    console.error('❌ Error creando/actualizando producto:', error)
    return { ok: false, message: 'Error al guardar el producto' }
  }
}

const uploadImage = async (image: File) => {
  try {
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64}`
    )

    return upload.secure_url
  } catch (error) {
    console.error('❌ Error subiendo imagen a Cloudinary:', error)
    return null
  }
}
