import { AbstractRepository, EntityRepository } from 'typeorm';
import { Inventory, Purchase } from '@graphmarket/entities';
import { InsufficientQuantityError } from '@graphmarket/errors';
import { PurchaseCreateInput } from '@app/inputs';
import { FindPurchasesArgs } from '@app/args';

/**
 * Purchase repository.
 *
 * @see Purchase
 */
@EntityRepository(Purchase)
export default class PurchaseRepository extends AbstractRepository<Purchase> {
  /**
   * Enable or disable caching.
   */
  private static readonly cache: boolean = true;

  /**
   * Create a new purchase.
   *
   * @param userId - User id
   * @param inventoryId - Inventory id
   * @param purchase - Purchase create properties
   * @returns Created purchase
   * @throws InsufficientQuantityError If the inventory has insufficient quantity
   */
  public async create(
    userId: string,
    inventoryId: string,
    purchase: PurchaseCreateInput,
  ): Promise<Purchase> {
    const inventory: Inventory = await this.manager.findOneOrFail(Inventory, inventoryId);

    // Check inventory quantity
    if (inventory.quantity < purchase.quantity) throw new InsufficientQuantityError();

    // Decrease inventory quantity
    await this.manager
      .createQueryBuilder(Inventory, 'inventory')
      .update()
      .where('inventory.id = :inventoryId', { inventoryId })
      .set({ quantity: () => 'quantity - :quantity' })
      .setParameter('quantity', purchase.quantity)
      .execute();

    // Save purchase
    return this.manager.save(
      Purchase,
      this.manager.create(Purchase, {
        ...purchase,
        price: inventory.price,
        user: { id: userId },
        inventory: { id: inventoryId },
      }),
    );
  }

  /**
   * Read a purchase that matches the id.
   *
   * @param id - Purchase id
   * @returns Purchase found. undefined otherwise
   */
  public readOneById(id: string): Promise<Purchase | undefined> {
    return this.manager.findOne(Purchase, id, { cache: PurchaseRepository.cache });
  }

  /**
   * Read mutiple purchases.
   *
   * @param param0 - Find options
   * @returns Purchases found
   */
  public read({ skip, take, userId, inventoryId }: FindPurchasesArgs): Promise<Purchase[]> {
    return this.manager.find(Purchase, {
      where: {
        ...(userId && { user: { id: userId } }),
        ...(inventoryId && { inventory: { id: inventoryId } }),
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      cache: PurchaseRepository.cache,
    });
  }

  /**
   * Check if the review is verified.
   * A review is verified if the author of the review has bought the product of the review at least one time.
   *
   * @param reviewId Review id
   * @returns True if verified, false otherwise
   */
  public async isReviewVerified(reviewId: string): Promise<boolean> {
    const count = await this.manager
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
