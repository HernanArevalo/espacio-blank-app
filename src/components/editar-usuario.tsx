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
import { ArrowLeft, Save, Trash2, User as UserIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { updateUser } from "@/actions/user/update-user-by-id"
import { deleteUser } from "@/actions/user/delete-user-by-id"
import { Store, Role } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface EditarUsuarioProps {
  usuario: {
    id: number
    name: string
    email: string
    image: string | null
    role: Role
    tiendas: number[]|null
  }
  availableStores: Store[]
}

export function EditarUsuario({ usuario, availableStores }: EditarUsuarioProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: usuario.name,
    email: usuario.email,
    role: usuario.role,
    tiendas: usuario.tiendas,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ... (El resto de las funciones handleInputChange, handleTiendaToggle, handleSave son iguales a la respuesta anterior)
  // Recuerda que en handleSave usamos: data.append("stores", JSON.stringify(formData.tiendas))

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTiendaToggle = (tiendaId: number) => {
    setFormData((prev) => {
      const currentTiendas = prev.tiendas || []
      if (currentTiendas.includes(tiendaId)) {
        return { ...prev, tiendas: currentTiendas.filter((id) => id !== tiendaId) }
      } else {
        return { ...prev, tiendas: [...currentTiendas, tiendaId] }
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const data = new FormData()
      data.append("id", usuario.id.toString())
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("role", formData.role)
      data.append("stores", JSON.stringify(formData.tiendas))

      const res = await updateUser(data)

      if (res.ok) {
        toast.success("Usuario actualizado")
        router.refresh()
        router.push("/admin")
      } else {
        toast.error("Error", { description: res.message })
      }
    } catch (error) {
      toast.error("Error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    // ... lógica de deleteUser ...
    setIsLoading(true)
    try {
      const res = await deleteUser(usuario.id)
      if (res.ok) {
        toast.success("Eliminado")
        router.push("/admin")
      } else {
        toast.error(res.message)
      }
    } catch (e) { toast.error("Error") }
    finally { setIsLoading(false); setShowDeleteDialog(false) }
  }

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.role

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/usuarios")} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </div>
        <div className="flex space-x-3">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2" /> Eliminar</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>¿Eliminar?</DialogTitle><DialogDescription>Irreversible.</DialogDescription></DialogHeader>
              <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button><Button variant="destructive" onClick={handleDelete}>Eliminar</Button></div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={!isFormValid || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Nombre</Label>
              <Input 
                value={formData.name} 
                onChange={e => handleInputChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email} onChange={e => handleInputChange("email", e.target.value)} disabled />
            </div>
            <div><Label>Rol</Label>
              <Select value={formData.role} onValueChange={v => handleInputChange("role", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="owner">Dueño</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Tiendas</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto mt-2">
                {availableStores.map(t => (
                  <div key={t.id} className="flex items-center gap-2">
                    <Checkbox id={`st-${t.id}`} checked={formData.tiendas?.includes(t.id)} onCheckedChange={() => handleTiendaToggle(t.id)} />
                    <Label htmlFor={`st-${t.id}`}>{t.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Resumen */}
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent>
            <div className="border p-4 rounded flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={usuario?.image || "/placeholder.svg"}
                    alt={formData?.name}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>{formData?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div><div className="font-bold">{formData.name}</div>
                <div className="text-sm text-slate-500">{formData.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div><span className="text-sm text-slate-500">Rol:</span> <Badge variant="secondary">{formData.role}</Badge></div>
              <div><span className="text-sm text-slate-500 block mb-1">Acceso a Tiendas:</span>
                <div className="flex flex-wrap gap-1">
                  {formData.tiendas?.length === 0 ? <span className="text-xs text-slate-400">Ninguna</span> :
                    formData.tiendas?.map(tid => {
                      const st = availableStores.find(s => s.id === tid);
                      return <Badge key={tid} variant="outline">{st?.name}</Badge>
                    })
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}