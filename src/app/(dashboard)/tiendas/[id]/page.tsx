"use client";

import { TiendaPanel } from "@/components/tienda-panel"
import { useAuth } from "@/context/AuthContext"
import { redirect, } from "next/navigation"

export const dynamic = "force-dynamic";

export default function TiendaPage() {
  const { user } = useAuth()

  if (!user) {
    redirect("/")
  }

  return <TiendaPanel user={user} />
}
