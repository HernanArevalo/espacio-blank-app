'use server'

import prisma from "@/lib/prisma"
import { UserWithStores } from "@/types/prisma.types"

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        storesIds: {
          include: {
            store: true
          }
        }
      }
    }) as UserWithStores
    return user
  } catch (error) {
    console.error("Error obteniendo usuario:", error)
    return null
  }
}