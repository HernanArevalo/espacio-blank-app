"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NuevoUsuario } from "@/components/nuevo-usuario"
import type { UserRole } from "@/lib/data"

export default function NuevoUsuarioPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()

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

  return <NuevoUsuario />
}
