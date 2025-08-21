"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Store } from "lucide-react"
import { tiendas, usuariosConfig, type UserRole } from "@/lib/data"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole") as UserRole
    if (!role) {
      router.push("/")
      return
    }
    setUserRole(role)

    // Si el usuario solo tiene acceso a una tienda, redirigir automáticamente
    const userConfig = usuariosConfig[role]
    if (userConfig.tiendas.length === 1) {
      router.push(`/tienda/${userConfig.tiendas[0]}`)
    }
  }, [router])

  if (!userRole) return null

  const userConfig = usuariosConfig[userRole]
  const userTiendas = tiendas.filter((tienda) => userConfig.tiendas.includes(tienda.id))

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center">
        <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {userTiendas.length === 1 ? "Redirigiendo a tu tienda..." : "Selecciona una tienda para comenzar"}
        </h2>
        <p className="text-slate-600">
          {userTiendas.length === 1
            ? "Accediendo a tu panel de gestión"
            : "Elige una tienda del navbar para acceder a su panel de gestión"}
        </p>
      </div>
    </div>
  )
}
