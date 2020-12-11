import { AuthChecker } from 'type-graphql';
import { IContext } from '@app/types';

/**
 * Check if the user's role is allowed to execute the operation.
 *
 * @param resolverData - Resolver data mapped in the context
 * @param roles - Allowed roles to execute the operation
 * @returns True if authorized, false otherwise
 */
const authorizationMiddleware: AuthChecker<IContext> = ({ context: { user } }, roles) => {
  // If `@Authorized()`, check only is user exist
  if (roles.length === 0) return user !== undefined;

  // No user, restrict access
  if (!user) return false;

  // Grant access if the roles overlap
  return user.roles.some((role) => roles.includes(role));
};

export default authorizationMiddleware;
