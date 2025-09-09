"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EditarProductoProps {
  tienda: {
    id: number
    nombre: string
    imagen: string
    descripcion: string
  }
  producto: {
    id: number
    nombre: string
    imagen: string
    precio: number
    stock: number
    tiendaId: number
  }
}

export function EditarProducto({ tienda, producto }: EditarProductoProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    precio: producto.precio.toString(),
    stock: producto.stock.toString(),
    imagen: producto.imagen,
    descripcion: "",
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aquí iría la lógica para actualizar el producto
    console.log("Producto actualizado:", {
      id: producto.id,
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
    })

    setIsLoading(false)
    router.push(`/tienda/${tienda.id}`)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    // Simular eliminación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aquí iría la lógica para eliminar el producto
    console.log("Producto eliminado:", producto.id)

    setIsLoading(false)
    setShowDeleteDialog(false)
    router.push(`/tienda/${tienda.id}`)
  }

  const isFormValid = formData.nombre.trim() && formData.precio && formData.stock

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tienda/${tienda.id}`)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a {tienda.nombre}
          </Button>
        </div>
        <div className="flex space-x-3">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Eliminar producto?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El producto "{producto.nombre}" será eliminado permanentemente.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? "Eliminando..." : "Eliminar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={!isFormValid || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Producto</CardTitle>
            <CardDescription>Modifica la información del producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Remera Vintage"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) => handleInputChange("precio", e.target.value)}
                  placeholder="15000"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="imagen">URL de Imagen</Label>
              <Input
                id="imagen"
                value={formData.imagen}
                onChange={(e) => handleInputChange("imagen", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Descripción del producto..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vista previa */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Así se verá el producto en la tienda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <img
                src={formData.imagen || "/placeholder.svg"}
                alt={formData.nombre || "Producto"}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{formData.nombre || "Nombre del producto"}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Precio:</span>
                  <span className="font-medium">
                    ${formData.precio ? Number(formData.precio).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <Badge
                    variant={
                      Number(formData.stock) > 10 ? "default" : Number(formData.stock) > 5 ? "secondary" : "destructive"
                    }
                  >
                    {formData.stock || "0"}
                  </Badge>
                </div>
              </div>
              {formData.descripcion && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{formData.descripcion}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
