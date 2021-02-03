import { Container } from 'typedi';
import { User } from '@graphmarket/entities';
import { UserService } from '@app/services';

/**
 * User service instance.
 *
 * @see UserService
 */
const userService: UserService = Container.get(UserService);

/**
 * Resolve user reference.
 *
 * @param reference - User reference identifier
 * @returns User that match the reference identifier, undefined otherwise
 */
export default function resolveUserReference(
  reference: Pick<User, 'id'>,
): Promise<User | undefined> {
  return userService.readOneById(reference.id);
}
