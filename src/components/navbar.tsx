"use client"
import { useStore } from "@/store";
import { Button } from "./ui/button";
import { Store } from "@/interfaces";
import { LogOut, Settings } from "lucide-react";
import { Badge } from "./ui/badge";
import SignInButton from "./auth/sign-in";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { showAdminPanel, setShowAdminPanel, loading, setLoading } = useStore()
  const [stores, setStores] = useState([])

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("/api/stores");
        if (!res.ok) throw new Error("Error fetching stores");
        const data = await res.json();
        setStores(data);
      } catch (error) {
        console.error("Error loading stores:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const { user, status } = useAuth()


  const handleLogout = async () => {
    const res = await signOut()
    router.push('/')
  }

  return (
    <nav className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src={"/espacio-blank.png"} alt={"espacio blank logo"} width={50} height={50} />
        </Link>
        {/* <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-900">Espacio Blank</h1>
        </div> */}

        <div className="flex items-center space-x-4">
          {status !== "authenticated" ? (
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
                    size="sm"
                  // variant={selectedStore === tienda.id ? "default" : "outline"}
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
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col" >
                <h3 className="font-semibold text-sm">¡Hola {user?.name.split(" ")[0]}!</h3>
                <Badge className="bg-slate-200 text-black justify-center uppercase">{user?.role}</Badge>
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
