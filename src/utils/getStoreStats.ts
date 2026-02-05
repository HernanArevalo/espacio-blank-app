import { Store } from "@prisma/client";

  export const getTiendaStats = (tienda: Store) => {

    const sales = tienda.sales || []
    const products = tienda.products || []

    const stockTotal = products.reduce((sum, p) => sum + p.stock, 0)
    const ingresos = sales.reduce((sum, v) => sum + v.total, 0)

    return {
      productos: products.length,
      stockTotal,
      ventas: sales.length,
      ingresos,
    }
  }