import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

declare module "next-auth" {
  // 1. Extendemos la Sesión
  interface Session {
    user: {
      id: number
      role: Role
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }


  interface User extends DefaultUser {
    id: number
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    role: Role
  }
}