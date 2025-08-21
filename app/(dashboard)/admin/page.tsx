"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/admin-panel"
import type { UserRole } from "@/lib/data"

export default function AdminPage() {
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

  return <AdminPanel />
}
