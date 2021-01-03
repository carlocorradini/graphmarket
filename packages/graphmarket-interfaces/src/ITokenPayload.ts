import { UserRoles } from '@graphmarket/entities';

/**
 * Token custom payload.
 */
export default interface ITokenPayload {
  readonly id: string;
  readonly roles: UserRoles[];
}
