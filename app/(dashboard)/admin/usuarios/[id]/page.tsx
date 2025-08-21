"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { EditarUsuario } from "@/components/editar-usuario"
import type { UserRole } from "@/lib/data"

// Datos de ejemplo de usuarios
const usuariosEjemplo = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: "owner" as const,
    tiendas: [1],
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@example.com",
    rol: "seller" as const,
    tiendas: [2],
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlos@example.com",
    rol: "seller" as const,
    tiendas: [1, 2, 3, 4],
  },
]

export default function EditarUsuarioPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()
  const params = useParams()
  const usuarioId = Number(params.id)

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

  const usuario = usuariosEjemplo.find((u) => u.id === usuarioId)
  if (!usuario) {
    router.push("/admin")
    return null
  }

  return <EditarUsuario usuario={usuario} />
}
