import { SessionUser, User } from '@/interfaces';
import { useSession } from 'next-auth/react';

export function getUser():User {

  const {data} = useSession()

  return {
    name: data?.user?.name || "",
    image: data?.user?.image || "",
    email: data?.user?.email || "",
    role: 'admin',
    storesIds: [],
  };
}
