import { AbstractRepository, EntityRepository } from 'typeorm';
import { User } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { UserCreateInput, UserUpdateInput } from '@app/inputs';

/**
 * User repository.
 *
 * @see User
 */
@EntityRepository(User)
export default class UserRepository extends AbstractRepository<User> {
  /**
   * Enable or disable caching.
   */
  private static readonly cache: boolean = true;

  /**
   * Create a new user.
   *
   * @param user - User create properties
   * @returns Created user
   */
  public create(user: UserCreateInput): Promise<User> {
    return this.manager.save(User, this.manager.create(User, user));
  }

  /**
   * Read a user that matches the id.
   *
   * @param id - User id
   * @returns User found, undefined otherwise
   */
  public readOneById(id: string): Promise<User | undefined> {
    return this.manager.findOne(User, id, { cache: UserRepository.cache });
  }

  /**
   * Read the seller of the inventory.
   *
   * @param inventoryId - Inventory id
   * @returns Seller of the inventory, undefined otherwise
   */
  public readOnebyInventoryId(inventoryId: string): Promise<User | undefined> {
    return this.manager
      .createQueryBuilder(User, 'user')
      .innerJoin('user.inventories', 'inventory')
      .where('inventory.id = :inventoryId', { inventoryId })
      .cache(UserRepository.cache)
      .getOne();
  }

  /**
   * Read the user of the purchase.
   *
   * @param purchaseId - Purchase id
   * @returns User of the purchase, undefined otherwise
   */
  public readOnebyPurchaseId(purchaseId: string): Promise<User | undefined> {
    return this.manager
      .createQueryBuilder(User, 'user')
      .innerJoin('user.purchases', 'purchase')
      .where('purchase.id = :purchaseId', { purchaseId })
      .cache(UserRepository.cache)
      .getOne();
  }

  /**
   * Read the author of the review.
   *
   * @param reviewId - Review id
   * @returns Author of the review, undefined otherwise
   */
  public readOneByReviewId(reviewId: string): Promise<User | undefined> {
    return this.manager
      .createQueryBuilder(User, 'user')
      .innerJoin('user.reviews', 'review')
      .where('review.id = :reviewId', { reviewId })
      .cache(UserRepository.cache)
      .getOne();
  }

  /**
   * Read multiple users.
   *
   * @param param0 - Find options
   * @returns Users found
   */
  public read({ skip, take }: PaginationArgs): Promise<User[]> {
    return this.manager.find(User, { skip, take, cache: UserRepository.cache });
  }

  /**
   * Update the user.
   *
   * @param id - User id
   * @param user - User update properties
   * @returns Updated user
   */
  public async update(
    id: string,
    user: UserUpdateInput & Partial<Pick<User, 'avatar'>>,
  ): Promise<User> {
    // Check if user exists
    await this.manager.findOneOrFail(User, id);

    // Update
    await this.manager.update(User, id, this.manager.create(User, user));

    // Return updated user
    return this.manager.findOneOrFail(User, id);
  }

  /**
   * Delete the user.
   *
   * @param id - User id
   * @returns Deleted user
   */
  public async delete(id: string): Promise<User> {
    // Check if user exists
    const user: User = await this.manager.findOneOrFail(User, id);

    // Delete
    await this.manager.delete(User, id);

    // Return deleted user
    return user;
  }
}
