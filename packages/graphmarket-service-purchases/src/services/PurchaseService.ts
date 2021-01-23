/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import {
  EntityManager,
  FindManyOptions,
  MoreThanOrEqual,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { Purchase, Inventory } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
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
   */

  @Transaction()
  public async create(
    userId: string,
    inventoryId: string,
    purchase: Exclude<Purchase, 'user' | 'userId' | 'inventory' | 'inventoryId'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase> {
    if (
      (await manager!.count(Inventory, {
        where: { id: inventoryId, quantity: MoreThanOrEqual(purchase.quantity) },
      })) <= 0
    ) {
      // TODO mettere errore custom
      throw Error('Not enough quantity');
    }

    const newPurchase: Purchase = await manager!.save(
      Purchase,
      manager!.create(Purchase, {
        ...purchase,
        user: { id: userId },
        inventory: { id: inventoryId },
      }),
    );

    // Decrease inventory's quantity
    await manager!
      .createQueryBuilder(Inventory, 'inventory')
      .update()
      .where('inventory.id = :inventoryId', { inventoryId })
      .set({ quantity: () => 'quantity - :quantity' })
      .setParameter('quantity', purchase.quantity)
      .execute();

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
    options?: Pick<FindManyOptions, 'skip' | 'take'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase[]> {
    return manager!.find(Purchase, { ...options, cache: true });
  }

  /**
   * Read the purchases of the user identified by userId.
   *
   * @param userId - User id
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
}
