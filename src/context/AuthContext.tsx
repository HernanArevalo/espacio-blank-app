"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUser } from "@/actions/user";

interface AuthContextProps {
  session: any | null;
  user: any | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      getUser(session.user).then((data) => setUser(data));
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        status,
        isAuthenticated: status === "authenticated",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
