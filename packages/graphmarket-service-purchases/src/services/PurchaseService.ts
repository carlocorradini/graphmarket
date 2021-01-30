/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { Purchase, Inventory } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { InsufficientQuantityError } from '@graphmarket/errors';
import logger from '@graphmarket/logger';

/**
 * Purchase service.
 *
 * @see Purchase
 */
@Service()
export default class PurchaseService {
  /**
   * Create a new purchase.
   *
   * @param purchase - Purchase data input properties
   * @param manager - Transaction manager
   * @returns Created purchase
   * @throws QuantityError If quantity exceeds inventory's quantity
   */

  @Transaction()
  public async create(
    userId: string,
    inventoryId: string,
    purchase: Exclude<Purchase, 'user' | 'userId' | 'inventory' | 'inventoryId'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase> {
    const inventory: Inventory = await manager!.findOneOrFail(Inventory, inventoryId);

    // Check inventory's quantity
    if (inventory.quantity < purchase.quantity) {
      throw new InsufficientQuantityError();
    }

    // Decrease inventory's quantity
    await manager!
      .createQueryBuilder(Inventory, 'inventory')
      .update()
      .where('inventory.id = :inventoryId', { inventoryId })
      .set({ quantity: () => 'quantity - :quantity' })
      .setParameter('quantity', purchase.quantity)
      .execute();

    // Save purchase
    const newPurchase: Purchase = await manager!.save(
      Purchase,
      manager!.create(Purchase, {
        ...purchase,
        price: inventory.price,
        user: { id: userId },
        inventory: { id: inventoryId },
      }),
    );

    logger.info(`Created purchase ${newPurchase.id}`);

    return newPurchase;
  }

  /**
   * Read a purchase that matches the id.
   *
   * @param id - Purchase's id
   * @param manager - Transaction manager
   * @returns Purchase found, undefined otherwise
   */
  @Transaction()
  public readOne(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase | undefined> {
    return manager!.findOne(Purchase, id, { cache: true });
  }

  /**
   * Read a purchase that matches the id.
   * If no purchase exists rejects.
   *
   * @param id - Purchase's id
   * @param manager - Transaction manager
   * @returns Purchase found
   */
  @Transaction()
  public readOneOrFail(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase> {
    return manager!.findOneOrFail(Purchase, id, { cache: true });
  }

  /**
   * Read multiple purchases.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Purchases found
   */
  @Transaction()
  public read(
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase[]> {
    return manager!.find(Purchase, { ...options, cache: true });
  }

  /**
   * Read the purchases of the user identified by userId.
   *
   * @param userId - User id
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Purchases of the user
   */
  @Transaction()
  public readByUser(
    userId: string,
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase[]> {
    return manager!
      .createQueryBuilder(Purchase, 'purchase')
      .innerJoin('purchase.user', 'user')
      .where('user.id = :userId', { userId })
      .offset(options.skip)
      .limit(options.take)
      .getMany();
  }

  /**
   * Check if the review is verified.
   * A review is verified if the author has bought the product at least one time.
   *
   * @param reviewId - Review id
   * @param manager - Transaction manager
   * @returns True if verified, false otherwise
   */
  @Transaction()
  public async verifiedByReview(
    reviewId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<boolean> {
    const count = await manager!
      .createQueryBuilder(Purchase, 'purchase')
      .innerJoin('purchase.inventory', 'inventory')
      .innerJoin(
        'review',
        'review',
        'review.product_id = inventory.product_id AND review.author_id = purchase.user_id AND review.id = :reviewId',
        { reviewId },
      )
      .getCount();

    return count > 0;
  }
}
