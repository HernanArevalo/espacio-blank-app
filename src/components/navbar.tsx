"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LogOut, Settings, Store as StoreIcon } from "lucide-react"

import { useStore } from "@/store"
import { getStores } from "@/actions/stores"
import { Store } from "@prisma/client"


import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import SignInButton from "./auth/sign-in"

export default function Navbar() {
  const router = useRouter()

  const { data: session, status } = useSession()
  const user = session?.user

  const { showAdminPanel } = useStore()
  const [stores, setStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(true)

  useEffect(() => {
    async function fetchStoresData() {
      try {
        const data = await getStores()
        if (data) {
          setStores(data)
        }
      } catch (error) {
        console.error("Error loading stores:", error)
      } finally {
        setLoadingStores(false)
      }
    }

    fetchStoresData()
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }) // Redirige automáticamente
  }

  return (
    <nav className="border-b bg-white px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image 
            src={"/espacio-blank.png"} 
            alt={"espacio blank logo"} 
            width={50} 
            height={50} 
            priority
          />
        </Link>

        <div className="flex items-center space-x-4">
          
          {status !== "authenticated" ? (
            <div className="flex space-x-2 flex-wrap items-center">
              {!loadingStores && stores.map((store) => (
                <Button
                  key={store.id}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 cursor-default opacity-70"
                  disabled
                >
                  {store.name}
                </Button>
              ))}
              <SignInButton />
            </div>
          ) : (
            
            /* ESTADO: AUTENTICADO */
            <div className="flex gap-3 items-center">
              
              {/* Lista de Tiendas (Links) */}
              <div className="hidden md:flex gap-2">
                {stores.map((store) => (
                  <Link href={'/tienda/' + store.id} key={store.id}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <StoreIcon className="w-3 h-3 mr-2 text-slate-400"/>
                      {store.name}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Botón Admin (Solo si es admin) */}
              {user?.role === "admin" && (
                <Link href={'/admin'}>
                  <Button
                    variant={showAdminPanel ? "default" : "secondary"}
                    size="sm"
                    className={showAdminPanel ? "bg-blue-600 text-white" : ""}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              {/* Perfil de Usuario */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ml-2">
                <Avatar className="w-10 h-10 border border-slate-200">
                  <AvatarImage 
                    src={user?.image || ""} 
                    alt={user?.name || "Usuario"} 
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col sm:flex">
                  <span className="font-semibold text-sm leading-none text-slate-800">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 uppercase">
                        {user?.role}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}