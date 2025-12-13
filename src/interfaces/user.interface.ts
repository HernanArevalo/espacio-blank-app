import { Role } from './roles.interface';
import { DefaultSession } from "next-auth";
import { Store } from './store.interface';

export interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  storesIds: UserStore[];
}

interface UserStore {
  id: number
  userId: number
  storeId: number
  store: Store
}

export type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
} & DefaultSession['user']