'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

const userSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  stores: z.string().transform((str) => JSON.parse(str) as number[]),
})

export const updateUser = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  const parsed = userSchema.safeParse(data)

  if (!parsed.success) {
    return { ok: false, message: 'Datos inválidos' }
  }

  const { id, name, email, role, stores } = parsed.data

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos básicos del User
      await tx.user.update({
        where: { id },
        data: { name, email, role }
      })

      // 2. Actualizar tiendas (Tabla UserStore)
      // Primero borramos las relaciones existentes para este usuario
      await tx.userStore.deleteMany({
        where: { userId: id }
      })

      // Si hay tiendas seleccionadas, creamos las nuevas relaciones
      if (stores.length > 0) {
        await tx.userStore.createMany({
          data: stores.map((storeId) => ({
            userId: id,
            storeId: storeId
          }))
        })
      }
    })

    revalidatePath('/admin/usuarios')
    return { ok: true, message: 'Usuario actualizado correctamente' }
  } catch (error) {
    console.error('Error updating user:', error)
    return { ok: false, message: 'Error al actualizar el usuario' }
  }
}