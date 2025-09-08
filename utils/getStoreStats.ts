import { products } from "@/data/products"
import { sales } from "@/data/sales"
import { useStore } from "@/store"

  export const getTiendaStats = (tiendaId: number) => {

    const productos = products.filter((p) => p.storeId === tiendaId)
    const ventas = sales.filter((v) => v.storeId === tiendaId)
    const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0)
    const ingresos = ventas.reduce((sum, v) => sum + v.total, 0)

    return {
      productos: productos.length,
      stockTotal,
      ventas: ventas.length,
      ingresos,
    }
  }