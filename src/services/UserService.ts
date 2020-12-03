/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { UserCreateInput, UserUpdateInput } from '@app/graphql';
import { User } from '@app/entities';
import logger from '@app/logger';
import { CryptUtil } from '@app/util';
import { AuthenticationError } from '@app/error';
import TokenService from './TokenService';

/**
 * User service.
 *
 * @see User
 */
@Service()
export default class UserService {
  /**
   * Token service instance.
   */
  @Inject()
  private readonly tokenService!: TokenService;

  /**
   * Create a new user.
   *
   * @param user - User data input properties
   * @param manager - Transaction manager
   * @returns Created user
   */
  @Transaction()
  public async create(
    user: UserCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const newUser: User = await manager!.save(User, manager!.create(User, user));

    logger.info(`Created user ${newUser.id}`);

    return newUser;
  }

  /**
   * Read a user that matches the id.
   *
   * @param id - User's id
   * @param manager - Transaction manager
   * @returns User found, undefined otherwise
   */
  @Transaction()
  public async readOne(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User | undefined> {
    return manager!.findOne(User, id, { cache: true });
  }

  /**
   * Read a user that matches the id.
   * If no user exists rejects.
   *
   * @param id - User's id
   * @param manager - Transaction manager
   * @returns User found
   */
  @Transaction()
  public async readOneOrFail(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    return manager!.findOneOrFail(User, id, { cache: true });
  }

  /**
   * Read multiple users.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Users found
   */
  @Transaction()
  public async read(
    options?: FindManyOptions,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User[]> {
    return manager!.find(User, { ...options, cache: true });
  }

  /**
   * Update a user that matches the id with the given data.
   * If the password is updated the tokens are purged.
   *
   * @param id - User's id
   * @param user - User update properties
   * @param manager - Transaction manager
   * @returns Updated user
   * @see TokenService
   */
  @Transaction()
  public async update(
    id: string,
    user: UserUpdateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    // Check if user exists
    await this.readOneOrFail(id, manager);

    await manager!.update(User, id, manager!.create(User, user));

    // Purge jwt tokens if password is updated
    if (user.password) this.tokenService.purge(id);

    logger.info(`Updated user ${id}`);

    return this.readOneOrFail(id, manager);
  }

  /**
   * Delete a user that matches the id.
   * All user's tokens are purged.
   *
   * @param id - User's id
   * @param manager - Transaction manager
   * @returns Deleted user
   * @see TokenService
   */
  @Transaction()
  public async delete(id: string, @TransactionManager() manager?: EntityManager): Promise<User> {
    // Check if user exists and save it temporarily
    const user: User = await this.readOneOrFail(id, manager);

    await manager!.delete(User, id);

    // Purge jwt tokens
    this.tokenService.purge(id);

    logger.info(`Deleted user ${id}`);

    return user;
  }

  /**
   * Sign in procedure.
   *
   * @param username - User's username
   * @param password - User's password
   * @param manager - Transaction manager
   * @returns Encoded authentication token
   * @see TokenService
   */
  @Transaction()
  public async signIn(
    username: string,
    password: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<string> {
    const user: User | undefined = await manager!.findOne(
      User,
      { username },
      { select: ['id', 'password', 'roles'] },
    );

    // Check if user exists and password is valid
    if (!user || !(await CryptUtil.compare(password, user.password!))) {
      logger.warn(`Sign in procedure failed for user ${user ? user.id : '?'}`);

      throw new AuthenticationError();
    }

    logger.info(`Sign in procedure successed for user ${user.id}`);

    return this.tokenService.sign({ id: user.id, roles: user.roles });
  }

  /**
   * Sign out procedure.
   *
   * @param id - User's id
   * @see TokenService
   */
  public async signOut(id: string): Promise<void> {
    // Revoke token
    this.tokenService.revoke(id);

    logger.info(`Sign out procedure successed for user ${id}`);
  }
}
