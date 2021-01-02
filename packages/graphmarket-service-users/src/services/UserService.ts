/* eslint-disable class-methods-use-this */
import { ReadStream } from 'fs';
import { Inject, Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { User } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { PhoneAdapter, EmailAdapter, UploadAdapter, TokenAdapter } from '@graphmarket/adapters';
import { IToken } from '@graphmarket/interfaces';

/**
 * User service.
 *
 * @see User
 */
@Service()
export default class UserService {
  /**
   * Token adapter instance.
   */
  @Inject()
  private readonly tokenAdapter!: TokenAdapter;

  /**
   * Phone adapter instance.
   */
  @Inject()
  private readonly phoneAdapter!: PhoneAdapter;

  /**
   * Email adapter instance.
   */
  @Inject()
  private readonly emailAdapter!: EmailAdapter;

  /**
   * Upload adapter instance.
   */
  @Inject()
  private readonly uploadAdapter!: UploadAdapter;

  /**
   * Create a new user.
   *
   * @param user - User data input properties
   * @param manager - Transaction manager
   * @returns Created user
   */
  @Transaction()
  public async create(user: User, @TransactionManager() manager?: EntityManager): Promise<User> {
    const newUser: User = await manager!.save(User, manager!.create(User, user));

    // Send verification message
    await this.phoneAdapter.sendVerification(user.phone);

    // Send verification email
    await this.emailAdapter.sendVerification(user.email, { user: { username: user.username } });

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
    user: Partial<Omit<User, 'id'>>,
    token: Pick<IToken, 'sub' | 'iat'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    // Check if user exists
    await manager!.findOneOrFail(User, id);

    await manager!.update(User, id, manager!.create(User, user));

    // Purge tokens if password is updated
    if (user.password) await this.tokenAdapter.purge(token);

    logger.info(`Updated user ${id}`);

    return manager!.findOneOrFail(User, id);
  }

  /**
   * Update avatar for the user identified by the id.
   *
   * @param id - User's id
   * @param avatar - Avatar file
   * @param manager - Transaction manager
   * @returns Updated user
   * @see UploadService
   */
  @Transaction()
  public async updateAvatar(
    id: string,
    avatar: ReadStream,
    token: Pick<IToken, 'sub' | 'iat'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    // Check if user exists
    await manager!.findOneOrFail(User, id);

    // Upload avatar and extract generated url
    const url: string = (await this.uploadAdapter.upload({ resource: avatar, type: 'USER_AVATAR' }))
      .secure_url;

    return this.update(id, { avatar: url }, token, manager);
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
  public async delete(
    id: string,
    token: Pick<IToken, 'sub' | 'iat'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    // Check if user exists and save it temporarily
    const user: User = await manager!.findOneOrFail(User, id);

    await manager!.delete(User, id);

    // Purge jwt tokens
    await this.tokenAdapter.purge(token);

    logger.info(`Deleted user ${id}`);

    return user;
  }
}
