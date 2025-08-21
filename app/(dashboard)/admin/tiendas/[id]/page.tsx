"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { EditarTienda } from "@/components/editar-tienda"
import { tiendas, type UserRole } from "@/lib/data"

export default function EditarTiendaPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()
  const params = useParams()
  const tiendaId = Number(params.id)

  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole
    if (!role || role !== "super_admin") {
      router.push("/")
      return
    }
    setUserRole(role)
  }, [router])

  if (!userRole || userRole !== "super_admin") {
    return null
  }

  const tienda = tiendas.find((t) => t.id === tiendaId)
  if (!tienda) {
    router.push("/admin")
    return null
  }

  return <EditarTienda tienda={tienda} />
}
