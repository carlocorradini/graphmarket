/* eslint-disable class-methods-use-this */
import { ReadStream } from 'fs';
import { Inject, Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { User } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { PhoneAdapter, EmailAdapter, UploadAdapter, TokenAdapter } from '@graphmarket/adapters';
import { IToken } from '@graphmarket/interfaces';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { UserRepository } from '@app/repositories';
import { UserCreateInput, UserUpdateInput } from '@app/inputs';

/**
 * User service.
 *
 * @see User
 * @see UserRepository
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
  public async create(
    user: UserCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Create user
    const newUser: User = await userRepository.create(user);

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
  public readOneById(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User | undefined> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    return userRepository.readOneById(id);
  }

  /**
   * Read the seller of the inventory.
   *
   * @param inventoryId - Inventory id
   * @param manager - Transaction manager
   * @returns Seller of the inventory
   */
  @Transaction()
  public readOnebyInventory(
    inventoryId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User | undefined> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    return userRepository.readOnebyInventory(inventoryId);
  }

  /**
   * Read the seller of the purchase.
   *
   * @param purchaseId - Purchase id
   * @param manager - Transaction manager
   * @returns Seller of the purchase
   */
  @Transaction()
  public readOnebyPurchase(
    purchaseId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User | undefined> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    return userRepository.readOnebyPurchase(purchaseId);
  }

  /**
   * Read the author of the review.
   *
   * @param reviewId - Review id
   * @param manager - Transaction manager
   * @returns Author of the review
   */
  @Transaction()
  public readOneByReview(
    reviewId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User | undefined> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    return userRepository.readOneByReview(reviewId);
  }

  /**
   * Read multiple users.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Users found
   */
  @Transaction()
  public read(
    options: PaginationArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User[]> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    return userRepository.read(options);
  }

  /**
   * Update the user.
   * If the password is updated the tokens are purged.
   *
   * @param id - User id
   * @param user - User update properties
   * @param token - User token
   * @param manager - Transaction manager
   * @returns Updated user
   * @see TokenService
   */
  @Transaction()
  public async update(
    id: string,
    user: UserUpdateInput,
    token: Pick<IToken, 'sub' | 'iat'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Update user
    const userUpdated: User = await userRepository.update(id, user);

    // Purge tokens if password is updated
    if (user.password) await this.tokenAdapter.purge(token);

    logger.info(`Updated user ${id}`);

    return userUpdated;
  }

  /**
   * Update avatar of the user.
   *
   * @param id - User id
   * @param avatar - Avatar file
   * @param manager - Transaction manager
   * @returns Updated user
   * @see UploadAdapter
   */
  @Transaction()
  public async updateAvatar(
    id: string,
    avatar: ReadStream,
    @TransactionManager() manager?: EntityManager,
  ): Promise<User> {
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Upload avatar and extract generated url
    const avatarUrl: string = (
      await this.uploadAdapter.upload({ resource: avatar, type: 'USER_AVATAR' })
    ).secure_url;

    // Update avatar
    const user: User = await userRepository.update(id, { avatar: avatarUrl });

    logger.info(`Updated user ${id} avatar`);

    return user;
  }

  /**
   * Delete the user.
   * All user tokens are purged.
   *
   * @param id - User id
   * @param token - User token
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
    const userRepository: UserRepository = manager!.getCustomRepository(UserRepository);

    // Delete user
    const user: User = await userRepository.delete(id);

    // Purge jwt tokens
    await this.tokenAdapter.purge(token);

    logger.info(`Deleted user ${id}`);

    return user;
  }
}
