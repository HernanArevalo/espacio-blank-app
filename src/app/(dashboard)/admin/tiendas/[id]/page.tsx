"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { EditarTienda } from "@/components/editar-tienda"
import { getUser } from "@/actions/user"
import { getStoreById } from "@/actions/store"
import { Store } from "@prisma/client";
import { useStore } from "@/store"
import { useAuth } from "@/context/AuthContext"

export const dynamic = "force-dynamic";

export default function EditarTiendaPage() {
  const router = useRouter()
  const params = useParams()
  const storeId = Number(params.id)
  const [tienda, setTienda] = useState<Store|null>(null)
  const { loading, setLoading } = useStore()

  const { user } = useAuth()

  const getTienda = async() => {
    const store = await getStoreById(storeId)
    if (!store) {
      router.push("/admin")
      return null
    }else{
      setTienda(store)
    }

  }

  useEffect(() => {
    setLoading(true)
    getTienda()
    
    if (!user.role || user.role !== "admin") {
      router.push("/")
      return
    }
    setLoading(false)
  }, [router])

  if (!user.role || user.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (tienda) {
    return <EditarTienda tienda={tienda} />
  }
}
