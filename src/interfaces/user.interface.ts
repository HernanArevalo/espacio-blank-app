import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type SessionUser = {
  id?: number
  role?: Role
  name?: string | null
  email?: string | null
  image?: string | null
} & DefaultSession["user"]
