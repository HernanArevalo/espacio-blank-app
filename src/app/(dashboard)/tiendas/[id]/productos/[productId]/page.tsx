import { redirect, notFound } from "next/navigation"
import { auth } from "@/app/auth" 
import { getProductById } from "@/actions/product/get-product-by-id"
import { getStoreById } from "@/actions/store/get-store-by-id"
import { EditarProducto } from "@/components/editar-producto"

interface Props {
  params: {
    id: string
    productId: string
  }
}

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: Props) {

  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }


  const storeId = Number(params.id)
  const productId = Number(params.productId)


  if (isNaN(storeId) || isNaN(productId)) {
    redirect("/")
  }


  const [tienda, producto] = await Promise.all([
    getStoreById(storeId),
    getProductById(productId)
  ])


  if (!tienda) {
    redirect("/admin") 
  }

  if (!producto) {
    redirect(`/tiendas/${storeId}`)
  }



  if (producto.storeId !== tienda.id) {
    console.error(`Intento de acceso cruzado: Producto ${productId} no pertenece a Tienda ${storeId}`)
    redirect(`/tiendas/${storeId}`)
  }


  return <EditarProducto tienda={tienda} producto={producto} />
}