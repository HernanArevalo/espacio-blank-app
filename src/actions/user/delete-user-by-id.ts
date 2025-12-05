'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteUser = async (userId: number) => {
  try {
    // Usamos transacción para limpiar dependencias si no hay Cascade en DB
    await prisma.$transaction(async (tx) => {
      // 1. Borrar relaciones con tiendas
      await tx.userStore.deleteMany({
        where: { userId }
      })
      
      // 2. Borrar usuario
      await tx.user.delete({
        where: { id: userId }
      })
    })

    revalidatePath("/admin/usuarios")
    return { ok: true, message: "Usuario eliminado" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { ok: false, message: "Error al eliminar usuario" }
  }
}