"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { tiendas } from "@/lib/data"

interface EditarUsuarioProps {
  usuario: {
    id: number
    nombre: string
    email: string
    rol: "super_admin" | "owner" | "seller"
    tiendas: number[]
  }
}

export function EditarUsuario({ usuario }: EditarUsuarioProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    tiendas: usuario.tiendas,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTiendaToggle = (tiendaId: number) => {
    setFormData((prev) => ({
      ...prev,
      tiendas: prev.tiendas.includes(tiendaId)
        ? prev.tiendas.filter((id) => id !== tiendaId)
        : [...prev.tiendas, tiendaId],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aquí iría la lógica para actualizar el usuario
    console.log("Usuario actualizado:", {
      id: usuario.id,
      ...formData,
    })

    setIsLoading(false)
    router.push("/admin")
  }

  const handleDelete = async () => {
    setIsLoading(true)
    // Simular eliminación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Aquí iría la lógica para eliminar el usuario
    console.log("Usuario eliminado:", usuario.id)

    setIsLoading(false)
    setShowDeleteDialog(false)
    router.push("/admin")
  }

  const isFormValid = formData.nombre.trim() && formData.email.trim() && formData.rol && formData.tiendas.length > 0

  const getRoleName = (rol: string) => {
    switch (rol) {
      case "super_admin":
        return "Super Administrador"
      case "owner":
        return "Dueño de Tienda"
      case "seller":
        return "Vendedor"
      default:
        return rol
    }
  }

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
                <DialogTitle>¿Eliminar usuario?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El usuario "{usuario.nombre}" será eliminado permanentemente del
                  sistema.
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
            <CardTitle>Editar Usuario</CardTitle>
            <CardDescription>Modifica la información del usuario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="juan@example.com"
              />
            </div>

            <div>
              <Label htmlFor="rol">Rol *</Label>
              <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Administrador</SelectItem>
                  <SelectItem value="owner">Dueño de Tienda</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tiendas Asignadas *</Label>
              <div className="space-y-3 mt-2">
                {tiendas.map((tienda) => (
                  <div key={tienda.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tienda-${tienda.id}`}
                      checked={formData.tiendas.includes(tienda.id)}
                      onCheckedChange={() => handleTiendaToggle(tienda.id)}
                    />
                    <Label htmlFor={`tienda-${tienda.id}`} className="flex-1">
                      {tienda.nombre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vista previa */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>Resumen del usuario actualizado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{formData.nombre || "Nombre del usuario"}</h3>
                  <p className="text-slate-600">{formData.email || "email@example.com"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-600">Rol</Label>
                  <div className="mt-1">
                    <Badge variant={formData.rol === "super_admin" ? "default" : "secondary"}>
                      {getRoleName(formData.rol) || "Sin asignar"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-slate-600">Tiendas Asignadas</Label>
                  <div className="mt-2 space-y-1">
                    {formData.tiendas.length === 0 ? (
                      <p className="text-sm text-slate-400">Ninguna tienda seleccionada</p>
                    ) : (
                      formData.tiendas.map((tiendaId) => {
                        const tienda = tiendas.find((t) => t.id === tiendaId)
                        return (
                          <Badge key={tiendaId} variant="outline">
                            {tienda?.nombre}
                          </Badge>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded">
                  <p className="text-sm text-slate-600">Permisos</p>
                  <ul className="text-sm mt-1 space-y-1">
                    {formData.rol === "super_admin" && (
                      <>
                        <li>• Gestión completa del sistema</li>
                        <li>• Crear/editar tiendas y usuarios</li>
                        <li>• Configurar descuentos</li>
                      </>
                    )}
                    {formData.rol === "owner" && (
                      <>
                        <li>• Gestionar productos de sus tiendas</li>
                        <li>• Ver reportes y estadísticas</li>
                        <li>• Procesar ventas</li>
                      </>
                    )}
                    {formData.rol === "seller" && (
                      <>
                        <li>• Ver productos de tiendas asignadas</li>
                        <li>• Procesar ventas</li>
                      </>
                    )}
                  </ul>
                </div>

                {formData.nombre !== usuario.nombre ||
                formData.email !== usuario.email ||
                formData.rol !== usuario.rol ||
                JSON.stringify(formData.tiendas.sort()) !== JSON.stringify(usuario.tiendas.sort()) ? (
                  <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Cambios detectados:</strong> El usuario será actualizado con la nueva información.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-sm text-gray-600">No hay cambios pendientes.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
