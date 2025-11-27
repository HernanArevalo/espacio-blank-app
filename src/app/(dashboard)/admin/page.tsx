"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/admin-panel"
import { useAuth } from "@/context/AuthContext"

export default function AdminPage() {
  const {user} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user.role !== "admin") {
      router.push("/")
      return
    }
  }, [router])

  return <AdminPanel />
}
