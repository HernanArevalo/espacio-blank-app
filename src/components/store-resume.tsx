"use client";

import { getUser } from "@/actions/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store as StoreInterface, User } from "@prisma/client";
import { getTiendaStats } from "@/utils"
import {
  ShoppingCart,
  EyeOff,
  Package,
  DollarSign,
  Store,
  BarChart3,
  TrendingUp,
  Lock,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  tienda: StoreInterface,
}

export const StoreResume = ({ tienda }: Props) => {
  const { user } = useAuth()
  const router = useRouter()

  const stats = getTiendaStats(tienda)
  const isAccessible = user && (user.role == 'admin' || user.storesIds.includes(tienda.id))

  const handleTiendaClick = (tiendaId: number) => {
    if (user) {
      console.log(user)
      router.push(`/tiendas/${tiendaId}`)
    }
  }

  return (
    <Card
      key={tienda.id}
      className={`relative transition-all duration-200 ${
          user? 
            "hover:shadow-lg cursor-pointer border-blue-200 hover:border-blue-300 hover:bg-blue-50 hover:bg-opacity-50"
            : "opacity-75"
        }`}
      onClick={() => isAccessible && handleTiendaClick(tienda.id)}
    >
      {!user && (
        <div className="absolute inset-0 bg-gray-100/60 rounded-lg flex items-center justify-center z-10">
          <div className="bg-white rounded-full p-2 shadow-sm">
            <Lock className="h-5 w-5 text-black" />
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={tienda.image || "placeholder.svg"} alt={tienda.name} />
              <AvatarFallback>{tienda.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{tienda.name}</CardTitle>
              <CardDescription>{tienda.description}</CardDescription>
            </div>
          </div>
          {user && isAccessible && (
            <Badge variant="default" className="bg-green-100 hover:bg-green-100 text-green-800 border-green-200">
              Acceso
            </Badge>
          )}
          {user && !isAccessible && (
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
                {(user && user.role !== "user") ? (
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-sm text-slate-600">Ingresos</span>
              </div>
              {(user && user.role !== "user") ? (
                <span className="font-semibold text-green-600">$ {stats.ingresos.toLocaleString()}</span>
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
        {!user && (
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
}
