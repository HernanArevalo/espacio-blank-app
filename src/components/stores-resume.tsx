import { getAllSales } from "@/actions/sales"
import { auth } from "@/app/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store as StoreInterface } from "@/interfaces"
import {
  ShoppingCart,
  EyeOff,
  Package,
  DollarSign,
  Store,
} from "lucide-react"

interface Props {
  stores: StoreInterface[]
}

export const StoresResume = async({ stores }: Props) => {

  const session = await auth()

  const statsGenerales = {
    totalTiendas: stores.length,
    totalProductos: stores.reduce((act, store)=> act + store.products.length, 0),
    totalVentas: stores.flatMap(store=> store.sales).length,
    totalIngresos: stores.flatMap(store => store.sales ?? []).reduce((acc, sale) => acc + (sale?.total ?? 0), 0)
  }

  return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiendas</CardTitle>
            <Store className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalTiendas}</div>
            <p className="text-xs text-slate-500">Tiendas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGenerales.totalProductos}</div>
            <p className="text-xs text-slate-500">En todas las tiendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
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
            // {true ? (
              <DollarSign  className="h-4 w-4 text-slate-400" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </CardHeader>
          <CardContent>
            {session ? (
            // {true ? (
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
  )
}
