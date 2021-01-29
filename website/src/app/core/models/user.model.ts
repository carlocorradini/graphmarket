export enum UserRoles {
  ADMINISTRATOR = 'ADMINISTRATOR',
  USER = 'USER',
  SELLER = 'SELLER',
}

export interface User {
  id: string;
  username: string;
  roles: UserRoles[];
  name: string;
  surname: string;
  fullName: string;
  avatar: string;
}
