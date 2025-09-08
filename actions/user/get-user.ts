import { SessionUser, User } from '@/interfaces';

export function getUser(sessionUser: SessionUser|null):User {

  return {
    name: 'Hernán Arévalo',
    email: 'hernanarevalo16@gmail.com',
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJB9AVV5Os3ukiYGdAOK3H1iY-mkQ1kxF79DLfzcDaFJql1BJ0=s96-c',
    role: 'admin',
    storesIds: [],
  };
}
