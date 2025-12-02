import { auth } from "@/app/auth" // Asegúrate de importar tu configuración de auth
import { redirect } from "next/navigation"
import { getStoreById } from "@/actions/store/get-store-by-id"
import { getProductById } from "@/actions/product/get-product-by-id"
import { EditarProducto } from "@/components/editar-producto"

interface Props {
  params: {
    id: string
    productId: string
  }
}

export default async function EditarProductoPage({ params }: Props) {
  // 1. Obtener sesión del servidor (Más seguro y rápido que useAuth en cliente)
  const session = await auth()
  
  if (!session?.user) {
    redirect("/")
  }

  const storeId = Number(params.id)
  const productId = Number(params.productId)

  if (isNaN(storeId) || isNaN(productId)) {
    redirect("/")
  }

  // 2. Obtener datos en paralelo (Waterfall optimization)
  // Usamos un action específico para el producto en lugar de traer toda la tienda y filtrar con .find()
  const [tienda, producto] = await Promise.all([
    getStoreById(storeId),
    getProductById(productId)
  ])

  // 3. Validaciones de seguridad y existencia
  if (!tienda || !producto) {
    redirect(`/tienda/${storeId}`)
  }

  // Verificar que el producto realmente pertenece a esta tienda (Seguridad)
  if (producto.storeId !== tienda.id) {
    redirect(`/tienda/${storeId}`)
  }

  // Verificar permisos (Opcional, si quieres ser estricto aquí además del layout)
  // const userRole = session.user.role;
  // if (userRole !== 'admin' && userRole !== 'owner') redirect("/");

  // 4. Renderizar el componente cliente con los datos listos
  return <EditarProducto tienda={tienda} producto={producto} />
}