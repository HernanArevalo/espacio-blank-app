"use client"

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"

export default function SignOutButton() {

  const handleLogin = async() => {
    const res = await signOut()

    console.log({res});
  }

  return <Button
    onClick={ handleLogin }
    variant="outline"
    size="sm"
    className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
  >
    <FcGoogle />
    Cerrar Sesión
  </Button>

}
