"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation"
import { Package, TrendingUp, Plus, ShoppingCart, Edit, Pencil } from "lucide-react"
import { getStoreById } from "@/actions/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VentaModal } from "@/components/venta-modal"
import { ProductoModal } from "@/components/producto-modal"
import { Store, User } from "@/interfaces"
import { useStore } from "@/store"
import { VentaRow } from './ventas/venta-row';

interface Props {
  user: User | null
}

export function TiendaPanel({ user }: Props) {
  const { showVentaModal, setShowVentaModal, showProductoModal, setShowProductoModal,
    loading, setLoading
  } = useStore()

  const router = useRouter()

  const { id: storeId } = useParams()

  const [tienda, setTienda] = useState<Store | null>(null)

  const getTienda = async () => {
    setLoading(true)
    const tienda = await getStoreById(Number(storeId))
    setTienda(tienda)
    setLoading(false)
    if (!tienda) {
      router.push("/")
      return null
    }
  }

  useEffect(() => {
    getTienda()
  }, [])


  const handleEditProduct = (productId: number) => {
    router.push(`/tienda/${storeId}/productos/${productId}`)
  }

  if (tienda) {

    return (
      <div className="container mx-auto px-6 py-8">
        {/* Header de la tienda */}
        <div className="flex items-center justify-between mb-8 gap-5 md:flex-row flex-col">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={tienda.image || "/placeholder.svg"} alt={tienda.name} />
              <AvatarFallback>{tienda.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{tienda.name}</h2>
              <p className="text-slate-600">{tienda.description}</p>
              {/* <Badge variant="outline" className="mt-1">
              {user.name}
            </Badge> */}
            </div>
          </div>

          <div className="flex flex-row justify-center items-center flex-wrap gap-3">
            {
              // (user.role === "seller" || user.role === "owner") && 
              (
                <Button onClick={() => setShowVentaModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Nueva Venta
                </Button>
              )}
            {["owner", "admin"].includes(user?.role || "") && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowProductoModal(true)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { router.push(`/admin/tiendas/${storeId}`) }}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Tienda
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tienda.products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tienda.products.reduce((sum, p) => sum + p.stock, 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tienda.sales?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${tienda.sales?.reduce((sum, v) => sum + v.total, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para productos y ventas */}
        <Tabs defaultValue="productos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
          </TabsList>

          <TabsContent value="productos">
            <Card>
              <CardHeader>
                <CardTitle>Inventario de Productos</CardTitle>
                <CardDescription>Gestiona el stock y precios de tus productos</CardDescription>
              </CardHeader>
              <CardContent>
                {tienda.products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay productos</h3>
                    <p className="text-slate-600">Esta tienda aún no tiene productos agregados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tienda.products.map((producto) => (
                      <Card key={producto.id}>
                        <CardContent className="p-4">
                          <img
                            src={producto.image || "/placeholder.png"}
                            alt={producto.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />

                          <h3 className="font-semibold text-lg mb-2">{producto.name}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Precio:</span>
                              <span className="font-medium">${producto.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Stock:</span>
                              <Badge
                                variant={
                                  producto.stock > 10 ? "default" : producto.stock > 5 ? "secondary" : "destructive"
                                }
                              >
                                {producto.stock}
                              </Badge>
                            </div>
                          </div>
                          {(["owner", "admin"].includes(user?.role || "")) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 bg-transparent"
                              onClick={() => handleEditProduct(producto.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ventas">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
                <CardDescription>Revisa todas las transacciones realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                {tienda.sales?.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay ventas</h3>
                    <p className="text-slate-600">Esta tienda aún no tiene ventas registradas</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* Columna vacía para el botón chevron */}
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tienda.sales?.map((venta) => (
                        // Usamos el nuevo componente aquí
                        <VentaRow key={venta.id} venta={venta} />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modales */}
        <VentaModal
          isOpen={showVentaModal}
          onClose={() => setShowVentaModal(false)}
          tienda={tienda}
          user={user}
        />

        <ProductoModal isOpen={showProductoModal} onClose={() => setShowProductoModal(false)} tienda={tienda} />
      </div>
    )
  } else {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }
}
