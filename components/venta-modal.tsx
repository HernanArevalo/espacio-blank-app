"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, CreditCard, Banknote, Smartphone, ShoppingCart, Check } from "lucide-react"
import { Sale, SaleItem, Store, User } from "@/interfaces"
import { GetProductsByStore } from "@/actions/products/get-products-by-store"
import { tiendas } from "@/lib/data"

interface VentaModalProps {
  isOpen: boolean
  onClose: () => void
  tienda: Store
  user: User
}

export function VentaModal({ isOpen, onClose, tienda, user }: VentaModalProps) {
  const [ventaItems, setVentaItems] = useState<SaleItem[]>([])
  const [searchProduct, setSearchProduct] = useState("")
  const [selectedTiendaVenta, setSelectedTiendaVenta] = useState<number | null>(null)
  const [cliente, setCliente] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [ventaCompletada, setVentaCompletada] = useState(false)

  // Obtener productos de la tienda actual o seleccionada
  const tiendaParaVenta = selectedTiendaVenta || tienda.id
  const productosActuales = GetProductsByStore(tienda.id)

  const addToVenta = (producto: any) => {
    const existingItem = ventaItems.find((item) => item.productId === producto.productId)
    if (existingItem) {
      setVentaItems(
        ventaItems.map((item) => (item.productId === producto.productId ? { ...item, cantidad: item.quantity + 1 } : item)),
      )
    } else {
      setVentaItems([...ventaItems, { ...producto, cantidad: 1 }])
    }
  }

  const removeFromVenta = (productId: number) => {
    setVentaItems(ventaItems.filter((item) => item.productId !== productId))
  }

  const updateCantidad = (productId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removeFromVenta(productId)
      return
    }
    setVentaItems(ventaItems.map((item) => (item.productId === productId ? { ...item, cantidad: nuevaCantidad } : item)))
  }

  const calculateSubtotal = () => {
    return ventaItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateDescuento = (metodo: string) => {
    switch (metodo) {
      case "efectivo":
        return 0.2
      case "transferencia":
        return 0.1
      case "tarjeta":
        return 0
      default:
        return 0
    }
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const descuento = calculateDescuento(metodoPago)
    return subtotal * (1 - descuento)
  }

  const procesarVenta = async () => {
    setIsProcessing(true)

    // Simular procesamiento de venta
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const ventaData = {
      tiendaId: tiendaParaVenta,
      cliente: cliente || "Cliente anónimo",
      productos: ventaItems,
      metodoPago,
      subtotal: calculateSubtotal(),
      descuento: calculateDescuento(metodoPago),
      total: calculateTotal(),
      fecha: new Date().toISOString(),
      vendedor: user.name,
    }

    console.log("Venta procesada:", ventaData)

    setIsProcessing(false)
    setVentaCompletada(true)

    // Resetear después de 2 segundos
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const handleClose = () => {
    setVentaItems([])
    setSearchProduct("")
    setSelectedTiendaVenta(null)
    setCliente("")
    setMetodoPago("")
    setVentaCompletada(false)
    onClose()
  }

  const isFormValid = ventaItems.length > 0 && metodoPago

  // Vista de venta completada
  if (ventaCompletada) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">¡Venta Completada!</h3>
            <p className="text-slate-600 mb-4">La venta se ha procesado correctamente</p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold text-green-600">${calculateTotal().toLocaleString()}</p>
            </div>
            <p className="text-sm text-slate-500">Cerrando automáticamente...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Nueva Venta</span>
          </DialogTitle>
          <DialogDescription>Agrega productos y completa la información de la venta</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector de productos */}
          <div className="lg:col-span-2 space-y-4">
            {/* Selector de tienda (solo para sellers con múltiples tiendas) */}
            {user.role === "seller" && (
              <div>
                <Label htmlFor="tienda-venta">Seleccionar Tienda</Label>
                <Select onValueChange={(value) => setSelectedTiendaVenta(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la tienda para esta venta" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiendas.map((tiendaOption) => (
                      <SelectItem key={tiendaOption.id} value={tiendaOption.id.toString()}>
                        {tiendaOption.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {productosActuales
                .filter((p) => p.name.toLowerCase().includes(searchProduct.toLowerCase()))
                .map((producto) => (
                  <div
                    key={producto.productId}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={producto.image || "/placeholder.svg"}
                        alt={producto.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{producto.name}</p>
                        <p className="text-sm text-gray-600">${producto.price.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">
                          Stock: {producto.stock}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => addToVenta(producto)} disabled={producto.stock === 0}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          {/* Carrito y resumen */}
          <div className="space-y-4">
            <div>
              <Label>Carrito de Compras</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                {ventaItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">${item.price.toLocaleString()} c/u</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-transparent"
                          onClick={() => updateCantidad(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-transparent"
                          onClick={() => updateCantidad(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFromVenta(item.productId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {ventaItems.length === 0 && <p className="text-gray-500 text-center py-8 text-sm">Carrito vacío</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente (Opcional)</Label>
                <Input
                  id="cliente"
                  placeholder="Nombre del cliente"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="metodo">Método de Pago *</Label>
                <Select onValueChange={setMetodoPago}>
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

              {metodoPago && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toLocaleString()}</span>
                  </div>
                  {calculateDescuento(metodoPago) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento ({(calculateDescuento(metodoPago) * 100).toFixed(0)}%):</span>
                      <span>-${(calculateSubtotal() * calculateDescuento(metodoPago)).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={procesarVenta} disabled={!isFormValid || isProcessing}>
                {isProcessing ? "Procesando..." : "Procesar Venta"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
