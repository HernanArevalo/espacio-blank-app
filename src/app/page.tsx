import {
  Settings,
  Store,
  Users,
} from "lucide-react"

import { getStores } from "@/actions/stores";
import { StoresResume } from "@/components/stores-resume";
import { StoreResume } from "@/components/store-resume"
import { auth } from "./auth";
import SignInButton from "@/components/auth/sign-in";
import { Button } from "@/components/ui/button";

export default async function HomePage() {

  const session = await auth()
  
  const stores = await getStores()

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Store className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">ESPACIO BLANK</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Gestioná múltiples tiendas, productos y ventas desde una plataforma centralizada. <br />
          {session && " Inicia sesión para acceder a todas las funcionalidades."}
        </p>
      </div>

      {/* Estadísticas Generales */}
      <StoresResume stores={stores} />


      {/* Resumen por Tienda */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Resumen por Tiendas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stores.map((tienda) => {
            return <StoreResume key={tienda.id} tienda={tienda} />
          })}
        </div>
      </div>

      {/* Call to Action */}
      {!session && (
        <div className="text-center bg-white rounded-lg border p-8">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">¿Listo para empezar?</h3>
          <p className="text-slate-600 mb-6">
            Inicia sesión para acceder a tus tiendas, ver la información financiera completa y comenzar a gestionar productos y ventas.
          </p>
          <div className="flex justify-center space-x-4">

            <SignInButton />
          </div>
        </div>
      )}

      {session && (
        <div className="text-center bg-white rounded-lg border p-8">
          <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">¡Bienvenido, {session.user?.name?.split(" ")[0]}!</h3>
          <p className="text-slate-600 mb-6">
            Hacé clic en cualquier tienda a la que tengas acceso para comenzar a gestionar productos y ventas.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Ir al Dashboard Completo
          </Button> 
        </div>
      )}
     
    </div>
  )
}

