"use client"
import { useStore } from "@/store";
import { Button } from "./ui/button";
import { Store } from "@/interfaces";
import { LogOut, Settings } from "lucide-react";
import { Badge } from "./ui/badge";
import SignInButton from "./auth/sign-in";
import { signOut, useSession } from "next-auth/react";
import { getUser } from "@/actions/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { stores, showAdminPanel, setShowAdminPanel } = useStore()


  const { data:session } = useSession()
  const user = getUser(session?.user || null)

  const handleLogout = async () => {
    const res = await signOut()
    router.push('/')
  }

  return (
    <nav className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src={"/espacio-blank.png"} alt={"Espacio Blank logo"} width={50} height={50}/>
        </Link>
        {/* <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-900">Espacio Blank</h1>
        </div> */}

        <div className="flex items-center space-x-4">
          {!session ? (
            <div className="flex space-x-2 flex-wrap">
              {stores.map((store: Store) => (
                <Button
                  onClick={() => { }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  key={store.id}
                  disabled
                >
                  {store.name}
                </Button>

              ))
              }

              <SignInButton />
            </div>
          ) : (
              <div className="flex gap-2 items-center">
                {stores.map((store: Store) => (
                  <Link href={'/tienda/' + store.id}
                        key={store.id}>
                    <Button
                      // variant={selectedStore === tienda.id ? "default" : "outline"}
                      size="sm"
                      // className={
                        //   selectedStore === tienda.id
                        //     ? "bg-blue-600 hover:bg-blue-700 text-white"
                        //     : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        // }
                        >
                      {store.name}
                    </Button>
                  </Link>
                ))}
                {user?.role === "admin" && (
                  <Link href={'/admin'}>
                    <Button
                      variant={showAdminPanel ? "default" : "outline"}
                      size="sm"
                      className={
                        showAdminPanel
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }
                      >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex flex-col" >
                  <h3 className="font-semibold text-sm">¡Hola {user?.name.split(" ")[0]}!</h3>
                  <Badge className="bg-slate-200 text-black justify-center">{user.role}</Badge>
                </div>
                <button
                  onClick={() => { handleLogout() }}
                  className="text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 p-4 rounded-md transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
          )}
        </div>
      </div>
    </nav>
  )
}
