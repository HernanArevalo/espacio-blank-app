"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Lock,
  Store,
  Settings,
  ShoppingCart,
  TrendingUp,
  EyeOff,
  Package,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react"

import { useSession } from "next-auth/react"
import { getUser } from "@/actions/user"
import { useStore } from "@/store"
import { getTiendaStats } from "@/utils/getStoreStats"
import SignInButton from "@/components/auth/sign-in"

export default function HomePage() {
  const router = useRouter()

  const { data: session, status } = useSession()
  const user = getUser(session?.user || null)

  const { stores: tiendas,
    setLoading, loading
  } = useStore()

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, setLoading]);

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

  const handleLogin = (role:string) => {
  }

  const statsGenerales = {
    // totalTiendas: stores.length,
    // totalProductos: productosEjemplo.length,
    // totalVentas: ventasEjemplo.length,
    // totalIngresos: ventasEjemplo.reduce((sum, v) => sum + v.total, 0),
    totalTiendas: 5,
    totalProductos: 354,
    totalVentas: 234,
    totalIngresos: 254980,
  }

    const handleTiendaClick = (tiendaId: number) => {
    if (session) {
      router.push(`/tienda/${tiendaId}`)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Store className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">ESPACIO BLANK</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Gestioná múltiples tiendas, productos y ventas desde una plataforma centralizada.
          {!session && " Inicia sesión para acceder a todas las funcionalidades."}
        </p>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tiendas</CardTitle>
            <Store className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalTiendas}</div>
            <p className="text-xs text-slate-500">Tiendas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalProductos}</div>
            <p className="text-xs text-slate-500">En todas las tiendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalVentas}</div>
            <p className="text-xs text-slate-500">Transacciones realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            {session ? (
              <DollarSign  className="h-4 w-4 text-slate-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </CardHeader>
          <CardContent>
            {session ? (
              <>
                <div className="text-2xl font-bold text-green-600">
                  ${statsGenerales.totalIngresos.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">Ingresos acumulados</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-400">••••••</div>
                <p className="text-xs text-slate-400">Inicia sesión para ver</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen por Tiendas */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Resumen por Tiendas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {tiendas.map((tienda) => {

            const stats = getTiendaStats(tienda.id)
            const isAccessible = session && (user.role == 'admin' || user.storesIds.includes(tienda.id))

            return (
              <Card
                key={tienda.id}
                className={`relative transition-all duration-200 ${session
                    ? isAccessible
                      ? "hover:shadow-lg cursor-pointer border-blue-200 hover:border-blue-300"
                      : "opacity-60 cursor-not-allowed"
                    : "opacity-75"
                  }`}
                onClick={() => isAccessible && handleTiendaClick(tienda.id)}
              >
                {!session && (
                  <div className="absolute inset-0 bg-gray-200/30 rounded-lg flex items-center justify-center z-10">
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <Lock className="h-5 w-5 text-black" />
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={tienda.image || "/placeholder.svg"} alt={tienda.name} />
                        <AvatarFallback>{tienda.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tienda.name}</CardTitle>
                        <CardDescription>{tienda.description}</CardDescription>
                      </div>
                    </div>
                    {session && isAccessible && (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        Acceso
                      </Badge>
                    )}
                    {session && !isAccessible && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Sin acceso
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Productos</span>
                        </div>
                        <span className="font-semibold">{stats.productos}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Stock</span>
                        </div>
                        <span className="font-semibold">{stats.stockTotal}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Ventas</span>
                        </div>
                        <span className="font-semibold">{stats.ventas}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {session ? (
                            <TrendingUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-sm text-slate-600">Ingresos</span>
                        </div>
                        {session ? (
                          <span className="font-semibold text-green-600">${stats.ingresos.toLocaleString()}</span>
                        ) : (
                          <span className="font-semibold text-slate-400">••••••</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Alertas informativas */}
                  {stats.productos === 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">Esta tienda no tiene productos agregados</p>
                    </div>
                  )}

                  {stats.ventas === 0 && stats.productos > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">Tienda lista para comenzar a vender</p>
                    </div>
                  )}

                  {/* Alerta de información restringida */}
                  {!session && stats.ingresos > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">Información financiera restringida</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      {!session && (
        <div className="text-center bg-white rounded-lg border p-8">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">¿Listo para empezar?</h3>
          <p className="text-slate-600 mb-6">
            Inicia sesión para acceder a tus tiendas, ver la información financiera completa y comenzar a gestionar productos y ventas.
          </p>
          <div className="flex justify-center space-x-4">

            <SignInButton />
          </div>
        </div>
      )}

      {session && (
        <div className="text-center bg-white rounded-lg border p-8">
          <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">¡Bienvenido, {user.name}!</h3>
          <p className="text-slate-600 mb-6">
            Haz clic en cualquier tienda a la que tengas acceso para comenzar a gestionar productos y ventas.
          </p>
          <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
            Ir al Dashboard Completo
          </Button>
        </div>
      )}
    </div>
  )
}

