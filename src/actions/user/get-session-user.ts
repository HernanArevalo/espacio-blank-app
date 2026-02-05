"use server";

import { SessionUser } from '@/interfaces';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function getUser(sessionUser:SessionUser|null|undefined): Promise<User|null> {

  if (!sessionUser) {
    return null
  }

  try {
    const user = await prisma.user.findFirst({ where: { email: sessionUser?.email || "" } })
    return {
      name: user?.name || "",
      image: user?.image || "",
      email: user?.email || "",
      role: user?.role || 'user',
      storesIds: [],
    };
    
  } catch (error) {
    console.error("error finding user", error)
    
    return null
  }
}
