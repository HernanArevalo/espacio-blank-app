"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save } from "lucide-react"

export function NuevaTienda() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  })
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

    // Aquí iría la lógica para crear la tienda
    console.log("Nueva tienda creada:", formData)

    setIsLoading(false)
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
        <Button onClick={handleSave} disabled={!isFormValid || isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Creando..." : "Crear Tienda"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Nueva Tienda</CardTitle>
            <CardDescription>Completa la información para crear una nueva tienda</CardDescription>
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
            <CardDescription>Así se verá la tienda en el sistema</CardDescription>
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
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-sm text-slate-600">Ventas</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
