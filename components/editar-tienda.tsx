"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EditarTiendaProps {
  tienda: {
    id: number
    nombre: string
    imagen: string
    descripcion: string
  }
}

export function EditarTienda({ tienda }: EditarTiendaProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: tienda.nombre,
    descripcion: tienda.descripcion,
    imagen: tienda.imagen,
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

    // Aquí iría la lógica para actualizar la tienda
    console.log("Tienda actualizada:", {
      id: tienda.id,
      ...formData,
    })

    setIsLoading(false)
    router.push("/admin")
  }

  const handleDelete = async () => {
    setIsLoading(true)
    // Simular eliminación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aquí iría la lógica para eliminar la tienda
    console.log("Tienda eliminada:", tienda.id)

    setIsLoading(false)
    setShowDeleteDialog(false)
    router.push("/admin")
  }

  const isFormValid = formData.nombre.trim() && formData.descripcion.trim()

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel Admin
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
                <DialogTitle>¿Eliminar tienda?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. La tienda "{tienda.nombre}" y todos sus datos serán eliminados
                  permanentemente.
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
            <CardTitle>Editar Tienda</CardTitle>
            <CardDescription>Modifica la información de la tienda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="nombre">Nombre de la Tienda *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Fashion Store"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Describe qué tipo de productos vende esta tienda..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imagen">URL del Logo</Label>
              <Input
                id="imagen"
                value={formData.imagen}
                onChange={(e) => handleInputChange("imagen", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Vista previa */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Así se verá la tienda actualizada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={formData.imagen || "/placeholder.svg"} alt={formData.nombre} />
                  <AvatarFallback>{formData.nombre.charAt(0) || "T"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{formData.nombre || "Nombre de la tienda"}</h3>
                  <p className="text-slate-600">{formData.descripcion || "Descripción de la tienda"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-sm text-slate-600">Productos</p>
                  <p className="text-2xl font-bold">
                    {tienda.id === 1 ? "2" : tienda.id === 2 ? "2" : tienda.id === 3 ? "1" : "1"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-sm text-slate-600">Ventas</p>
                  <p className="text-2xl font-bold">{tienda.id === 1 ? "2" : tienda.id === 2 ? "1" : "0"}</p>
                </div>
              </div>

              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Los cambios afectarán a todos los usuarios y productos asociados a esta tienda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
