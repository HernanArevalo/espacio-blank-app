"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Percent, Save, Store, Trash2 } from "lucide-react"

import { Store as StoreInterface } from "@/interfaces"

interface EditarTiendaProps {
  tienda: StoreInterface
}

export function EditarTienda({ tienda }: EditarTiendaProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: tienda.name,
    description: tienda.description,
    image: tienda.image,
  })
  // const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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

    console.log("Tienda actualizada:", {
      id: tienda.id,
      ...formData,
    })

    setIsLoading(false)
    router.push("/admin")
  }

  const isFormValid = formData.name.trim() && formData.description?.trim()

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
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Fashion Store"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe qué tipo de productos vende esta tienda..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">URL del Logo</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
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
                  <AvatarImage src={formData.image || "/placeholder.svg"} alt={formData.name} />
                  <AvatarFallback>{formData.name.charAt(0) || "T"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{formData.name || "Nombre de la tienda"}</h3>
                  <p className="text-slate-600">{formData.description || "Descripción de la tienda"}</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Configuración de Descuentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Efectivo</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" defaultValue="20" className="w-20" min={0} max={100}/>
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Transferencia</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" defaultValue="10" className="w-20" min={0} max={100}/>
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tarjeta</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" defaultValue="0" className="w-20" min={0} max={100}/>
                <Percent className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
