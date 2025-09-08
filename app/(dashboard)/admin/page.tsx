"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/admin-panel"
import type { UserRole } from "@/lib/data"
import { getUser } from "@/actions/user"
import { useSession } from "next-auth/react"

export default function AdminPage() {
  const { data:session} = useSession()
  const user = getUser(session?.user || null)
  const router = useRouter()

  useEffect(() => {
    if (!user.role || user.role !== "admin") {
      router.push("/")
      return
    }
  }, [router])

  return <AdminPanel />
}
