"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && !user) return;

    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, status, router]);

  if (status === "loading" || (status === "authenticated" && !user)) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null; 
  }

  return <AdminPanel />;
}