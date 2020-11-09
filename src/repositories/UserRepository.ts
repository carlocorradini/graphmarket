/* eslint-disable class-methods-use-this */
import {
  AbstractRepository,
  EntityManager,
  EntityRepository,
  FindManyOptions,
  Transaction,
  TransactionManager,
} from 'typeorm';
import blacklist from 'express-jwt-blacklist';
import { UserCreateInput, UserUpdateInput } from '@app/graphql/inputs';
import User from '@app/entities/User';
import { CryptUtil } from '@app/util';
import { JWTHelper } from '@app/helper';
import { AuthenticationError } from '@app/error';
import logger from '@app/logger';
import { IJWT } from '@app/types';

/**
 * User database repository.
 */
@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  /**
   * Create a new user from data.
   *
   * @param data - User data input properties
   * @param manager - Transaction's entity manager
   * @returns Newly created user
   */
  @Transaction()
  public async createOrFail(
    data: UserCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = await manager!.save(manager!.create(User, data));
    logger.info(`Created user having id ${user.id}`);

    return user;
  }

  /**
   * Read a user that matches the given id.
   *
   * @param id - User's id
   * @returns User with the corresponding id
   */
  public readOneOrFail(id: string): Promise<User> {
    return this.manager.findOneOrFail(User, id, { cache: true });
  }

  /**
   * Read multiple users that match given options.
   *
   * @param options - Find options
   * @returns Users that match given options.
   */
  public readOrFail(options?: FindManyOptions): Promise<User[]> {
    return this.manager.find(User, { ...options, cache: true });
  }

  /**
   * Update a user that matches the id with the given data.
   * If the password is updated the authentication JWT is purged.
   *
   * @param id - User's id
   * @param data - User data update input properties
   * @param jwt - User's authentication JWT decoded token
   * @param manager - Transaction's entity manager
   * @returns Updated user
   */
  @Transaction()
  public async updateOrFail(
    id: string,
    data: UserUpdateInput,
    jwt: IJWT,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = manager!.create(User, data);
    await manager!.update(User, id, user);

    // Purge all jwt tokens if password exists
    if (data.password) blacklist.purge(jwt);

    logger.info(`Updated user having id ${id}`);

    return manager!.findOneOrFail(User, id);
  }

  /**
   * Delete a user that matches the given id.
   * All user's JWT authentication tokens are purged.
   *
   * @param id - User's id
   * @param jwt - User's authentication JWT decoded token
   * @param manager - Transaction's entity manager
   * @returns Deleted user
   */
  @Transaction()
  public async deleteOrFail(
    id: string,
    jwt: IJWT,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const user: User = await manager!.findOneOrFail(User, id);
    await manager!.delete(User, id);

    // Purge all jwt tokens
    blacklist.purge(jwt);

    logger.info(`Deleted user having id ${id}`);

    return user;
  }

  /**
   * User's sign in procedure.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Encoded JWT authentication token
   * @see JWTHelper
   */
  async signIn(username: string, password: string): Promise<string> {
    const user: User | undefined = await this.manager.findOne(
      User,
      { username },
      { select: ['id', 'password', 'roles'] },
    );

    if (!user || !(await CryptUtil.compare(password, user.password!))) {
      logger.warn(`Signed in failed user having id ${user ? user.id : undefined}`);
      throw new AuthenticationError();
    }
    logger.info(`Signed in successfully user having id ${user.id}`);

    return JWTHelper.sign({ id: user.id, roles: user.roles });
  }

  /**
   * User's sign out procedure.
   * User's JWT authentication token is revoked.
   *
   * @param jwt - User's authentication JWT decoded token
   * @returns True if signed out, false otherwise
   */
  async signOut(jwt: IJWT): Promise<boolean> {
    // Revoke jwt token
    blacklist.revoke(jwt);
    logger.info(`Signed out successfullt user having id ${jwt.id}`);
    return true;
  }
}
