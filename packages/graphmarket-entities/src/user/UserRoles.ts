import { registerEnumType } from 'type-graphql';

/**
 * User roles.
 */
enum UserRoles {
  ADMINISTRATOR = 'ADMINISTRATOR',
  USER = 'USER',
  SELLER = 'SELLER',
}

registerEnumType(UserRoles, { name: 'UserRoles', description: `User roles` });

export default UserRoles;
