"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { EditarTienda } from "@/components/editar-tienda"
import { useSession } from "next-auth/react"
import { getUser } from "@/actions/user"
import { getStoreById } from "@/actions/store"

export default function EditarTiendaPage() {
  const router = useRouter()
  const params = useParams()
  const storeId = Number(params.id)

  const { data:session} = useSession()
  const user = getUser(session?.user || null)

  useEffect(() => {
    if (!user.role || user.role !== "admin") {
      router.push("/")
      return
    }

  }, [router])

  if (!user.role || user.role !== "admin") {
    return null
  }

  const tienda = getStoreById(storeId)
  if (!tienda) {
    router.push("/admin")
    return null
  }

  return <EditarTienda tienda={tienda} />
}
