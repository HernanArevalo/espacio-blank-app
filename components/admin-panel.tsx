"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, UserPlus, Store, Percent } from "lucide-react"
import { tiendas } from "@/lib/data"

// Datos de ejemplo de usuarios
const usuariosEjemplo = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    rol: "owner" as const,
    tiendas: [1],
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@example.com",
    rol: "seller" as const,
    tiendas: [2],
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlos@example.com",
    rol: "seller" as const,
    tiendas: [1, 2, 3, 4],
  },
]

export function AdminPanel() {
  const router = useRouter()

  const handleNuevaTienda = () => {
    router.push("/admin/tiendas/nueva")
  }

  const handleNuevoUsuario = () => {
    router.push("/admin/usuarios/nuevo")
  }

  const handleEditarTienda = (tiendaId: number) => {
    router.push(`/admin/tiendas/${tiendaId}`)
  }

  const handleEditarUsuario = (usuarioId: number) => {
    router.push(`/admin/usuarios/${usuarioId}`)
  }

  const getTiendasNombres = (tiendaIds: number[]) => {
    return tiendaIds.map((id) => tiendas.find((t) => t.id === id)?.nombre).join(", ")
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
          <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
        </TabsList>

        <TabsContent value="tiendas" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestión de Tiendas</h3>
            <Button onClick={handleNuevaTienda}>
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
                    <Button variant="outline" size="sm" onClick={() => handleEditarTienda(tienda.id)}>
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
                {usuariosEjemplo.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.rol === "owner" ? "default" : "secondary"}>
                        {usuario.rol === "owner" ? "Owner" : "Seller"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTiendasNombres(usuario.tiendas)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditarUsuario(usuario.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
  )
}
