"use client";

import { useEffect } from "react";
import { useStore } from "@/store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { fetchStores, fetchSales } = useStore();

  useEffect(() => {
    fetchStores();
    fetchSales();
  }, []);

  return <>{children}</>;
}
