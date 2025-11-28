"use client"

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"

export default function SignInButton() {

  const handleLogin = async() => {
    const res = await signIn("google")

    console.log({res});
  }

  return <Button
    onClick={ () => signIn("google") }
    variant="outline"
    size="sm"
    className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold flex flex-row gap-1"
  >
    <FcGoogle />
      Iniciar Sesión
  </Button>

}
