"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NuevaTienda } from "@/components/nueva-tienda"
import type { UserRole } from "@/lib/data"
import { useAuth } from "@/context/AuthContext"


export default function NuevaTiendaPage() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(user?.role || null)
  const router = useRouter()

  useEffect(() => {
    if (!user?.role || user.role !== "admin") {
      router.push("/")
      return
    }
    setUserRole(user.role)
  }, [router])

  if (!userRole || userRole !== "admin") {
    return null
  }

  return <NuevaTienda />
}
