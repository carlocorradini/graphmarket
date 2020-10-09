import { AuthChecker } from 'type-graphql';
import { IContext } from '@app/types';

const AuthorizationMiddleware: AuthChecker<IContext> = ({ context: { user } }, roles) => {
  // If `@Authorized()`, check only is user exist
  if (roles.length === 0) return user !== undefined;
  // No user, restrict access
  if (!user) return false;
  // Grant access if the roles overlap
  return user.roles.some((role) => roles.includes(role));
};

export default AuthorizationMiddleware;
