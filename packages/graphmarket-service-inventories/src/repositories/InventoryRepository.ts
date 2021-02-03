import {
  AbstractRepository,
  EntityRepository,
  FindOperator,
  LessThanOrEqual,
  MoreThan,
} from 'typeorm';
import { Inventory } from '@graphmarket/entities';
import { EntityAlreadyExistsError } from '@graphmarket/errors';
import { InventoryCreateInput, InventoryUpdateInput } from '@app/inputs';
import { FindInventoriesArgs } from '@app/args';
import { InventoryStock } from '@app/args/FindInventoriesArgs';

/**
 * Inventory repository.
 *
 * @see Inventory
 */
@EntityRepository(Inventory)
export default class InventoryRepository extends AbstractRepository<Inventory> {
  /**
   * Enable or disable caching.
   */
  private static readonly cache: boolean = true;

  /**
   * Convert the stock enum into a find operator.
   *
   * @param stock - The stock to convert
   * @returns Find operator for the stock
   */
  private static stockToQuantity(
    stock: InventoryStock | undefined,
  ): FindOperator<number> | undefined {
    let quantity: FindOperator<number> | undefined;

    switch (stock) {
      case InventoryStock.IN_STOCK:
        quantity = MoreThan(0);
        break;
      case InventoryStock.OUT_OF_STOCK:
        quantity = LessThanOrEqual(0);
        break;
      default:
        quantity = undefined;
        break;
    }

    return quantity;
  }

  /**
   * Create a new inventory.
   *
   * @param productId - Product id
   * @param sellerId - Seller id
   * @param inventory - Create inventory properties
   * @returns Created inventory
   * @throws EntityAlreadyExistsError If an inventory already exists
   */
  public async create(
    productId: string,
    sellerId: string,
    inventory: InventoryCreateInput,
  ): Promise<Inventory> {
    // Count inventory of the product made by the seller
    const count: number = await this.manager.count(Inventory, {
      where: {
        product: { id: productId },
        seller: { id: sellerId },
        condition: inventory.condition,
      },
    });

    // If count is not 0 an inventory already exists
    if (count !== 0) throw new EntityAlreadyExistsError();

    // Save inventory
    return this.manager.save(
      Inventory,
      this.manager.create(Inventory, {
        ...inventory,
        product: { id: productId },
        seller: { id: sellerId },
      }),
    );
  }

  /**
   * Read an inventory that matches the id.
   *
   * @param id - Inventory id
   * @returns Inventory found, undefined otherwise
   */
  public readOneById(id: string): Promise<Inventory | undefined> {
    return this.manager.findOne(Inventory, id, { cache: InventoryRepository.cache });
  }

  /**
   * Read mutiple reviews.
   *
   * @param param0 - Find options
   * @returns Inventories found
   */
  public read({
    skip,
    take,
    stock,
    productId,
    sellerId,
  }: FindInventoriesArgs & { productId?: string; sellerId?: string }): Promise<Inventory[]> {
    const quantity = InventoryRepository.stockToQuantity(stock);

    return this.manager.find(Inventory, {
      where: {
        ...(quantity && { quantity }),
        ...(productId && { product: { id: productId } }),
        ...(sellerId && { seller: { id: sellerId } }),
      },
      skip,
      take,
      order: { condition: 'ASC', price: 'ASC' },
      cache: InventoryRepository.cache,
    });
  }

  /**
   * Update the inventory.
   *
   * @param id - Inventory id
   * @param inventory - Inventory update properties
   * @returns Updated inventory
   */
  public async update(id: string, inventory: InventoryUpdateInput): Promise<Inventory> {
    // Check if inventory exists
    await this.manager.findOneOrFail(Inventory, id);

    // Update
    await this.manager.update(Inventory, id, this.manager.create(Inventory, inventory));

    // Return updated inventory
    return this.manager.findOneOrFail(Inventory, id);
  }

  /**
   * Delete the inventory.
   *
   * @param id - Inventory id
   * @returns Deleted inventory
   */
  public async delete(id: string): Promise<Inventory> {
    // Check if inventory exists
    const inventory: Inventory = await this.manager.findOneOrFail(Inventory, id);

    // Delete
    await this.manager.delete(Inventory, id);

    // Return deleted inventory
    return inventory;
  }

  /**
   * Returns the total quantity of the product in the inventories.
   *
   * @param productId - Product id
   * @returns Total quantity of the product
   */
  public async productTotalQuantity(productId: string): Promise<number> {
    const { quantity }: { quantity: number } = await this.manager
      .createQueryBuilder(Inventory, 'inventory')
      .select('COALESCE(SUM(inventory.quantity), 0)', 'quantity')
      .where('inventory.product_id = :productId', { productId })
      .getRawOne();

    return quantity;
  }

  /**
   * Returns the best product's selling price in the inventories.
   *
   * @param productId - Product id
   * @returns Best product's selling price, undefined otherwise
   */
  public async bestProductPrice(productId: string): Promise<number | undefined> {
    const { price }: { price: number | undefined } = (await this.manager
      .createQueryBuilder(Inventory, 'inventory')
      .addSelect('inventory.condition')
      .select('MIN(inventory.price)', 'price')
      .where('inventory.product_id = :productId', { productId })
      .andWhere('inventory.quantity > 0')
      .groupBy('inventory.condition')
      .orderBy('inventory.condition')
      .limit(1)
      .getRawOne()) || { price: undefined };

    return price;
  }
}
