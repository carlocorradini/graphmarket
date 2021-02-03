/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Purchase } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { PurchaseCreateInput } from '@app/inputs';
import { PurchaseRepository } from '@app/repositories';
import { FindPurchasesArgs } from '@app/args';

/**
 * Purchase service.
 *
 * @see Purchase
 * @see PurchaseRepository
 */
@Service()
export default class PurchaseService {
  /**
   * Create a new purchase.
   *
   * @param userId - User i
   * @param inventoryId - Inventory id
   * @param purchase - Purchase data input properties
   * @param manager - Transaction manager
   * @returns Created purchase
   */

  @Transaction()
  public async create(
    userId: string,
    inventoryId: string,
    purchase: PurchaseCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase> {
    const purchaseRepository: PurchaseRepository = manager!.getCustomRepository(PurchaseRepository);

    const newPurchase: Purchase = await purchaseRepository.create(userId, inventoryId, purchase);

    logger.info(`Created purchase ${newPurchase.id}`);

    return newPurchase;
  }

  /**
   * Read a purchase that matches the id.
   *
   * @param id - Purchase id
   * @param manager - Transaction manager
   * @returns Purchase found, undefined otherwise
   */
  @Transaction()
  public readOneById(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase | undefined> {
    const purchaseRepository: PurchaseRepository = manager!.getCustomRepository(PurchaseRepository);

    return purchaseRepository.readOneById(id);
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
    options: FindPurchasesArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Purchase[]> {
    const purchaseRepository: PurchaseRepository = manager!.getCustomRepository(PurchaseRepository);

    return purchaseRepository.read(options);
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
  public async isReviewVerified(
    reviewId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<boolean> {
    const purchaseRepository: PurchaseRepository = manager!.getCustomRepository(PurchaseRepository);

    return purchaseRepository.isReviewVerified(reviewId);
  }
}
