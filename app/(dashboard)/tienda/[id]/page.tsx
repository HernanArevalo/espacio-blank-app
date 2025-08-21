"use client"

import { useRouter, useParams } from "next/navigation"
import { TiendaPanel } from "@/components/tienda-panel"
import { getUser } from "@/actions/user"
import { useSession } from "next-auth/react"
import { getStore } from "@/actions/store/get-store"

export default function TiendaPage() {
  const router = useRouter()
  const params = useParams()
  const tiendaId = Number(params.id)

  const { data:session} = useSession()
  const user = getUser(session?.user || null)


  const tienda = getStore(tiendaId)
  if (!tienda) {
    router.push("/")
    return null
  }

  return <TiendaPanel tienda={tienda} user={user} />
}
