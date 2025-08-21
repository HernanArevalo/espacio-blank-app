// Datos de ejemplo y configuraciones
export const tiendas = [
  {
    id: 1,
    nombre: "Vintage Vibes",
    imagen: "/placeholder.svg?height=80&width=80",
    descripcion: "Ropa vintage y accesorios únicos",
  },
  { id: 2, nombre: "Tech Corner", imagen: "/placeholder.svg?height=80&width=80", descripcion: "Gadgets y tecnología" },
  {
    id: 3,
    nombre: "Artisan Crafts",
    imagen: "/placeholder.svg?height=80&width=80",
    descripcion: "Artesanías y productos hechos a mano",
  },
  {
    id: 4,
    nombre: "Green Life",
    imagen: "/placeholder.svg?height=80&width=80",
    descripcion: "Productos sustentables y eco-friendly",
  },
]

// Configuración de usuarios con sus tiendas asignadas
export const usuariosConfig = {
  super_admin: {
    nombre: "Admin Principal",
    tiendas: tiendas.map((t) => t.id), // Acceso a todas las tiendas
  },
  owner_vintage: {
    nombre: "Dueño Vintage Vibes",
    tiendas: [1], // Solo Vintage Vibes
  },
  owner_tech: {
    nombre: "Dueño Tech Corner",
    tiendas: [2], // Solo Tech Corner
  },
  seller_vintage: {
    nombre: "Vendedor Vintage",
    tiendas: [1], // Solo puede vender en Vintage Vibes
  },
  seller_tech: {
    nombre: "Vendedor Tech",
    tiendas: [2], // Solo puede vender en Tech Corner
  },
  seller_general: {
    nombre: "Vendedor General",
    tiendas: [1, 2, 3, 4], // Puede vender en todas las tiendas
  },
}

export type UserRole = keyof typeof usuariosConfig

export const productosEjemplo = [
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

export const ventasEjemplo = [
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

// Determinar el tipo de rol (super_admin, owner, seller)
export const getRoleType = (role: UserRole): "super_admin" | "owner" | "seller" => {
  if (role === "super_admin") return "super_admin"
  if (role.startsWith("owner_")) return "owner"
  return "seller"
}
