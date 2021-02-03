/* eslint-disable class-methods-use-this */
import { Inject, Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Purchase } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { EmailAdapter } from '@graphmarket/adapters';
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
   * Email adapter instance.
   */
  @Inject()
  private readonly emailAdapter!: EmailAdapter;

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

    // Create purchase
    const newPurchase: Purchase = await purchaseRepository.create(userId, inventoryId, purchase);

    // Obtain email info
    const emailPurchase: Purchase = await purchaseRepository.readOneForPurchaseEmail(
      newPurchase.id,
    );

    // Send email
    await this.emailAdapter.sendPurchaseConfirmation(emailPurchase.user.email, {
      user: {
        username: emailPurchase.user.username,
      },
      product: {
        name: emailPurchase.inventory.product.name,
        cover:
          emailPurchase.inventory.product.photos.length > 0
            ? emailPurchase.inventory.product.photos[0]
            : 'https://res.cloudinary.com/dxiqa0xwa/image/upload/v1609604389/graphmarket/product/photo/product.png',
      },
      purchase: {
        quantity: emailPurchase.quantity,
        amount: ((emailPurchase.price * emailPurchase.quantity) / 100).toFixed(2),
      },
    });
    logger.info(`Purchase ${newPurchase.id} confirmation email sended`);

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
