"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { EditarProducto } from "@/components/editar-producto"
import { tiendas, usuariosConfig, productosEjemplo, getRoleType, type UserRole } from "@/lib/data"

export default function EditarProductoPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()
  const params = useParams()
  const tiendaId = Number(params.id)
  const productId = Number(params.productId)

  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole
    if (!role) {
      router.push("/")
      return
    }

    // Verificar si el usuario tiene acceso a esta tienda
    const userConfig = usuariosConfig[role]
    const roleType = getRoleType(role)

    if (!userConfig.tiendas.includes(tiendaId) || roleType !== "owner") {
      router.push("/")
      return
    }

    setUserRole(role)
  }, [router, tiendaId])

  if (!userRole) return null

  const tienda = tiendas.find((t) => t.id === tiendaId)
  const producto = productosEjemplo.find((p) => p.id === productId && p.tiendaId === tiendaId)

  if (!tienda || !producto) {
    router.push(`/tienda/${tiendaId}`)
    return null
  }

  return <EditarProducto tienda={tienda} producto={producto} />
}
