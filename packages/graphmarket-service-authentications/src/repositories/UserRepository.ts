import { AbstractRepository, EntityRepository } from 'typeorm';
import { User } from '@graphmarket/entities';

/**
 * User repository.
 *
 * @see User
 */
@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  /**
   * Read a user that matches the id.
   *
   * @param id - User id
   * @returns User found, undefined otherwise
   */
  public readOneById(id: string): Promise<User | undefined> {
    return this.manager.findOne(User, id);
  }

  /**
   * Read a user by username.
   * This method is used only for sign in procedure since it forces the selection of
   * required data.
   *
   * @param username - User username
   * @returns User found, undefined otherwise
   */
  public readOneForSignIn(username: string): Promise<User | undefined> {
    return this.manager.findOne(
      User,
      { username },
      { select: ['id', 'password', 'roles', 'verified'] },
    );
  }

  /**
   * Read a user that matches the id.
   * This method is used only for resend procedure since it forces the selection of
   * required data.
   *
   * @param id - User id
   * @returns User found, undefined otherwise
   */
  public readOneForResend(id: string): Promise<User | undefined> {
    return this.manager.findOne(User, id, {
      select: ['verified', 'phone', 'email', 'username'],
    });
  }

  /**
   * Update the user verified status.
   *
   * @param id - User id
   *
   * @returns Updated user
   * @see TokenService
   */

  /**
   * Update the user verified status.
   *
   * @param id - User id
   * @param verified - Verified status
   * @returns Updated user
   */
  public async updateVerifiedStatus(id: string, verified: boolean): Promise<User> {
    // Check if user exists
    await this.manager.findOneOrFail(User, id);

    // Update
    await this.manager.update(User, id, { verified });

    // Return updated user
    return this.manager.findOneOrFail(User, id);
  }
}
