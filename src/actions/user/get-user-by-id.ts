'use server'

import prisma from "@/lib/prisma"

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
    })
    return user
  } catch (error) {
    console.error("Error obteniendo usuario:", error)
    return null
  }
}