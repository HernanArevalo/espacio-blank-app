import { auth } from "@/app/auth"
import { redirect, notFound } from "next/navigation"
import { getUserById } from "@/actions/user/get-user-by-id"
import { getStores } from "@/actions/stores"
import { EditarUsuario } from "@/components/editar-usuario"

interface Props {
  params: { id: string }
}

export const dynamic = "force-dynamic";

export default async function EditarUsuarioPage({ params }: Props) {

  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }


  const userId = Number(params.id)
  if (isNaN(userId)) notFound()


    const [usuario, allStores] = await Promise.all([
    getUserById(userId),
    getStores()
  ])

  if (!usuario) {
    redirect("/admin")
  }


  const formattedUser = {
    id: usuario.id,
    name: usuario.name,
    email: usuario.email,
    role: usuario.role,
    image: usuario.image,

    tiendas: usuario.storesIds.map((relacion) => relacion.storeId) 
  }

  return (
    <EditarUsuario 
      usuario={formattedUser} 
      availableStores={allStores || []} 
    />
  )
}