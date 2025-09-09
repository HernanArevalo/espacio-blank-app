import { Role } from './roles.interface';
import { DefaultSession } from "next-auth";

export interface User {
  name: string;
  email: string;
  image?: string;
  role: Role;
  storesIds: number[];
}

export type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
} & DefaultSession['user']