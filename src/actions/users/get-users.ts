'use server'

import prisma from "@/lib/prisma"

export const getUsers = async () => {
  try {
    const user = await prisma.user.findMany({
      include: {
        storesIds: {include: {store: true}}
      }
    })
    return user
  } catch (error) {
    console.error("Error obteniendo usuario:", error)
    return null
  }
}