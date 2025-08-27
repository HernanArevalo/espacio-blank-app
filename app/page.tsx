"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Lock,
  Store,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  Search,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  Edit,
  UserPlus,
  Percent,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tiendas, usuariosConfig, type UserRole } from "@/lib/data"
import { useSession } from "next-auth/react"
import { getUser } from "@/actions/user"
import { useStore } from "@/store"

export default function HomePage() {
  const { showVentaModal, setShowVentaModal, 
          showProductoModal, setShowProductoModal,
          showAdminPanel, setShowAdminPanel
        } = useStore()

  const [userRole, setUserRole] = useState<UserRole>("seller_vintage")
  const [selectedTienda, setSelectedTienda] = useState<number | null>(null)
  // const [showVentaModal, setShowVentaModal] = useState(false)
  // const [showProductoModal, setShowProductoModal] = useState(false)
  // const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [ventaItems, setVentaItems] = useState<any[]>([])
  const [searchProduct, setSearchProduct] = useState("")
  const [selectedTiendaVenta, setSelectedTiendaVenta] = useState<number | null>(null)

  const router = useRouter()

  const { data:session} = useSession()
    const user = getUser(session?.user || null)

  useEffect(() => {
    if (!session) {
      router.push("/")
    }
  }, [router])

  // Obtener configuración del usuario actual
  const currentUser = usuariosConfig[userRole]
  const userTiendas = tiendas.filter((tienda) => currentUser.tiendas.includes(tienda.id))

  const addToVenta = (producto: any) => {
    const existingItem = ventaItems.find((item) => item.id === producto.id)
    if (existingItem) {
      setVentaItems(
        ventaItems.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)),
      )
    } else {
      setVentaItems([...ventaItems, { ...producto, cantidad: 1 }])
    }
  }

  const removeFromVenta = (productId: number) => {
    setVentaItems(ventaItems.filter((item) => item.id !== productId))
  }

  const calculateTotal = (metodoPago: string) => {
    const subtotal = ventaItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    let descuento = 0
    switch (metodoPago) {
      case "efectivo":
        descuento = 0.2
        break
      case "transferencia":
        descuento = 0.1
        break
      case "tarjeta":
        descuento = 0
        break
    }
    return subtotal * (1 - descuento)
  }

  // Filtrar productos por tienda seleccionada
  const getProductosByTienda = (tiendaId: number) => {
    return productosEjemplo.filter((producto) => producto.tiendaId === tiendaId)
  }

  // Filtrar ventas por tienda seleccionada
  const getVentasByTienda = (tiendaId: number) => {
    return ventasEjemplo.filter((venta) => venta.tiendaId === tiendaId)
  }

  // Pantalla inicial sin login
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Iniciá sesión para acceder a todas las funciones del sistema
            </h2>
            <p className="text-slate-600">Selecciona tu rol para acceder al panel de gestión</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiendas.map((tienda) => (
              <Card key={tienda.id} className="relative opacity-60">
                <div className="absolute inset-0 bg-gray-200/50 rounded-lg flex items-center justify-center z-10">
                  <Lock className="h-8 w-8 text-gray-500" />
                </div>
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={tienda.imagen || "/placeholder.svg"} alt={tienda.nombre} />
                    <AvatarFallback>{tienda.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{tienda.nombre}</CardTitle>
                  <CardDescription>{tienda.descripcion}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Panel de Admin
  if (showAdminPanel && user?.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h2>
            <p className="text-slate-600">Gestiona tiendas, usuarios y configuraciones</p>
          </div>

          <Tabs defaultValue="tiendas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tiendas">Tiendas</TabsTrigger>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
            </TabsList>

            <TabsContent value="tiendas" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Gestión de Tiendas</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Tienda
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tiendas.map((tienda) => (
                  <Card key={tienda.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={tienda.imagen || "/placeholder.svg"} alt={tienda.nombre} />
                          <AvatarFallback>{tienda.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{tienda.nombre}</CardTitle>
                          <CardDescription>{tienda.descripcion}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Tiendas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Juan Pérez</TableCell>
                      <TableCell>juan@example.com</TableCell>
                      <TableCell>
                        <Badge>Owner</Badge>
                      </TableCell>
                      <TableCell>Vintage Vibes</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>María García</TableCell>
                      <TableCell>maria@example.com</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Seller</Badge>
                      </TableCell>
                      <TableCell>Tech Corner</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Carlos Ruiz</TableCell>
                      <TableCell>carlos@example.com</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Seller General</Badge>
                      </TableCell>
                      <TableCell>Todas</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="descuentos" className="space-y-6">
              <h3 className="text-xl font-semibold">Configuración de Descuentos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tiendas.map((tienda) => (
                  <Card key={tienda.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Store className="h-5 w-5" />
                        <span>{tienda.nombre}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Efectivo</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue="20" className="w-20" />
                          <Percent className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Transferencia</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue="10" className="w-20" />
                          <Percent className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tarjeta</Label>
                        <div className="flex items-center space-x-2">
                          <Input type="number" defaultValue="0" className="w-20" />
                          <Percent className="h-4 w-4" />
                        </div>
                      </div>
                      <Button size="sm">Guardar Cambios</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Panel principal de tienda
  const tiendaSeleccionada = tiendas.find((t) => t.id === selectedTienda)



  if (!selectedTienda || !tiendaSeleccionada) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {userTiendas.length === 1 ? "Cargando tu tienda..." : "Selecciona una tienda para comenzar"}
            </h2>
            <p className="text-slate-600">
              {userTiendas.length === 1
                ? "Accediendo a tu panel de gestión"
                : "Elige una tienda del navbar para acceder a su panel de gestión"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const productosActuales = getProductosByTienda(selectedTienda)
  const ventasActuales = getVentasByTienda(selectedTienda)

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-6 py-8">
        {/* Header de la tienda */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={tiendaSeleccionada.imagen || "/placeholder.svg"} alt={tiendaSeleccionada.nombre} />
              <AvatarFallback>{tiendaSeleccionada.nombre.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{tiendaSeleccionada.nombre}</h2>
              <p className="text-slate-600">{tiendaSeleccionada.descripcion}</p>
              <Badge variant="outline" className="mt-1">
                {currentUser.nombre}
              </Badge>
            </div>
          </div>

          <div className="flex space-x-3">
            {(user.role === "seller" || user.role === "owner") && (
              <Button onClick={() => setShowVentaModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Nueva Venta
              </Button>
            )}
            {user.role === "owner" && (
              <Button
                variant="outline"
                onClick={() => setShowProductoModal(true)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productosActuales.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
              <Package className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productosActuales.reduce((sum, p) => sum + p.stock, 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventasActuales.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${ventasActuales.reduce((sum, v) => sum + v.total, 0).toLocaleString()}
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
                {productosActuales.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay productos</h3>
                    <p className="text-slate-600">Esta tienda aún no tiene productos agregados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productosActuales.map((producto) => (
                      <Card key={producto.id}>
                        <CardContent className="p-4">
                          <img
                            src={producto.imagen || "/placeholder.svg"}
                            alt={producto.nombre}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Precio:</span>
                              <span className="font-medium">${producto.precio.toLocaleString()}</span>
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
                          {user.role === "owner" && (
                            <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
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
                {ventasActuales.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay ventas</h3>
                    <p className="text-slate-600">Esta tienda aún no tiene ventas registradas</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ventasActuales.map((venta) => (
                        <TableRow key={venta.id}>
                          <TableCell>{venta.fecha}</TableCell>
                          <TableCell>{venta.cliente}</TableCell>
                          <TableCell>{venta.productos}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{venta.metodo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${venta.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nueva Venta */}
      <Dialog open={showVentaModal} onOpenChange={setShowVentaModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
            <DialogDescription>Agrega productos y completa la información de la venta</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selector de tienda (solo para sellers con múltiples tiendas) */}
            {user.role === "seller" && userTiendas.length > 1 && (
              <div className="lg:col-span-2">
                <Label htmlFor="tienda-venta">Seleccionar Tienda</Label>
                <Select onValueChange={(value) => setSelectedTiendaVenta(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la tienda para esta venta" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTiendas.map((tienda) => (
                      <SelectItem key={tienda.id} value={tienda.id.toString()}>
                        {tienda.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Selector de productos */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Buscar Producto</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre..."
                    className="pl-10"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {productosActuales
                  .filter((p) => p.nombre.toLowerCase().includes(searchProduct.toLowerCase()))
                  .map((producto) => (
                    <div key={producto.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-gray-600">${producto.precio.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addToVenta(producto)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Carrito y resumen */}
            <div className="space-y-4">
              <div>
                <Label>Productos Agregados</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ventaItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {item.cantidad} x ${item.precio.toLocaleString()} = $
                          {(item.cantidad * item.precio).toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => removeFromVenta(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {ventaItems.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cliente">Cliente (Opcional)</Label>
                  <Input id="cliente" placeholder="Nombre del cliente" />
                </div>

                <div>
                  <Label htmlFor="metodo">Método de Pago</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">
                        <div className="flex items-center space-x-2">
                          <Banknote className="h-4 w-4" />
                          <span>Efectivo (20% desc.)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="transferencia">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <span>Transferencia (10% desc.)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tarjeta">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Tarjeta (0% desc.)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        ${ventaItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${calculateTotal("efectivo").toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" disabled={ventaItems.length === 0}>
                  Guardar Venta
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Agregar Producto */}
      <Dialog open={showProductoModal} onOpenChange={setShowProductoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            <DialogDescription>Completa la información del producto para agregarlo al inventario</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input id="nombre" placeholder="Ej: Remera Vintage" />
            </div>

            <div>
              <Label htmlFor="precio">Precio</Label>
              <Input id="precio" type="number" placeholder="15000" />
            </div>

            <div>
              <Label htmlFor="cantidad">Cantidad Inicial</Label>
              <Input id="cantidad" type="number" placeholder="10" />
            </div>

            <div>
              <Label htmlFor="imagen">URL de Imagen</Label>
              <Input id="imagen" placeholder="https://..." />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea id="descripcion" placeholder="Descripción del producto..." />
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1">Guardar Producto</Button>
              <Button variant="outline" onClick={() => setShowProductoModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const productosEjemplo = [
  {
    id: 1,
    nombre: "Remera Vintage",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 15000,
    stock: 12,
    tiendaId: 1,
  },
  {
    id: 2,
    nombre: "Jeans Retro",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 25000,
    stock: 8,
    tiendaId: 1,
  },
  {
    id: 3,
    nombre: "Smartphone Pro",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 350000,
    stock: 5,
    tiendaId: 2,
  },
  {
    id: 4,
    nombre: "Auriculares Bluetooth",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 45000,
    stock: 15,
    tiendaId: 2,
  },
  {
    id: 5,
    nombre: "Maceta Artesanal",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 8000,
    stock: 20,
    tiendaId: 3,
  },
  {
    id: 6,
    nombre: "Botella Reutilizable",
    imagen: "/placeholder.svg?height=100&width=100",
    precio: 12000,
    stock: 30,
    tiendaId: 4,
  },
]

const ventasEjemplo = [
  { id: 1, fecha: "2024-01-15", cliente: "Juan Pérez", total: 40000, metodo: "Tarjeta", productos: 2, tiendaId: 1 },
  { id: 2, fecha: "2024-01-14", cliente: "María García", total: 25000, metodo: "Efectivo", productos: 1, tiendaId: 1 },
  {
    id: 3,
    fecha: "2024-01-14",
    cliente: "Carlos López",
    total: 350000,
    metodo: "Transferencia",
    productos: 1,
    tiendaId: 2,
  },
]
