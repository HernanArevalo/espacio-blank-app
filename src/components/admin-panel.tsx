"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, UserPlus, Store as StoreIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getStores } from "@/actions/stores"
import { deleteStoreById } from "@/actions/store/delete-store-by-id"
import { Store, User } from "@/interfaces"
import { toast } from "sonner"
import { getUsers } from "@/actions/users/get-users"


export function AdminPanel() {
  const router = useRouter()

  // Estados de datos
  const [stores, setStores] = useState<Store[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Estados para acciones
  const [isDeleting, setIsDeleting] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Cargar datos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiendasData = await getStores()
        if (tiendasData) {
          setStores(tiendasData)
        }
      } catch (error) {
        console.error("Error cargando tiendas:", error)
        toast.error("Error al cargar las tiendas")
      } finally {
        setLoadingData(false)
      }

      try {
        const userData = await getUsers()
        if (userData) {
          setUsers(userData)
        }
      } catch (error) {
        console.error("Error cargando tiendas:", error)
        toast.error("Error al cargar las tiendas")
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  // Handlers de navegación
  const handleNuevaTienda = () => router.push("/admin/tiendas/nueva")
  const handleNuevoUsuario = () => router.push("/admin/usuarios/nuevo")
  const handleEditarTienda = (id: number) => router.push(`/admin/tiendas/${id}`)
  const handleEditarUsuario = (id: number) => router.push(`/admin/usuarios/${id}`)

  // Lógica de eliminación de tienda
  const confirmDeleteStore = async () => {
    if (!storeToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteStoreById(storeToDelete)

      if (res.ok) {
        setStores((prev) => prev.filter((s) => s.id !== storeToDelete))
        toast.success("Tienda eliminada correctamente")
        setShowDeleteDialog(false)
      } else {
        toast.error("Error al eliminar", { description: res.message })
      }
    } catch (error) {
      toast.error("Error inesperado")
    } finally {
      setIsDeleting(false)
      setStoreToDelete(null)
    }
  }

  const openDeleteDialog = (id: number) => {
    setStoreToDelete(id)
    setShowDeleteDialog(true)
  }

  if (loadingData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h2>
        <p className="text-slate-600">Gestiona tiendas, usuarios y configuraciones</p>
      </div>

      <Tabs defaultValue="tiendas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tiendas">Tiendas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>

        {/* --- TAB TIENDAS --- */}
        <TabsContent value="tiendas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestión de Tiendas</h3>
            <Button onClick={handleNuevaTienda}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tienda
            </Button>
          </div>

          {stores.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <StoreIcon className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No hay tiendas</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva tienda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((tienda) => (
                <Card key={tienda.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-slate-50 border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={tienda.image || "/placeholder.svg"} alt={tienda.name} />
                        <AvatarFallback>{tienda.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tienda.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {tienda.description || "Sin descripción"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                      <span>ID: {tienda.id}</span>
                      {/* Puedes mostrar más info aquí si la traes en el include */}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditarTienda(tienda.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="px-3"
                        onClick={() => openDeleteDialog(tienda.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- TAB USUARIOS --- */}
        <TabsContent value="usuarios" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
            <Button onClick={handleNuevoUsuario}>
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
                {users.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.name}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.role === "admin" || usuario.role === "owner" ? "default" : "secondary"}>
                        {usuario.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex flex-col gap-1">
                      {usuario.storesIds.map((tienda) => (
                        <Badge variant={"secondary"} key={tienda.store.id} className="w-fit">
                          {tienda.store.name}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditarUsuario(usuario.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogo de Eliminación Global */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará la tienda y <strong>todos sus productos y ventas asociados</strong>.
              No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStore} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar Tienda"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}