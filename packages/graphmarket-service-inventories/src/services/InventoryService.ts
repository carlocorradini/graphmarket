/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import {
  EntityManager,
  FindOperator,
  LessThanOrEqual,
  MoreThan,
  Transaction,
  TransactionManager,
} from 'typeorm';
import { Inventory } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { FindInventoryArgs } from '@app/args';
import { InventoryStock } from '@app/args/FindInventoriesArgs';

/**
 * Inventory service.
 *
 * @see Inventory
 */
@Service()
export default class InventoryService {
  /**
   * Convert the stock enum into a find operator.
   *
   * @param stock - The stock to convert
   * @returns Find operator for the stock
   */
  private stockToQuantity(stock: InventoryStock | undefined): FindOperator<number> | undefined {
    let quantity: FindOperator<number> | undefined = undefined;

    switch (stock) {
      case InventoryStock.IN_STOCK:
        quantity = MoreThan(0);
        break;
      case InventoryStock.OUT_OF_STOCK:
        quantity = LessThanOrEqual(0);
        break;
    }

    return quantity;
  }

  /**
   * Create a new inventory.
   *
   * @param productId - Product id
   * @param sellerId - Seller id
   * @param inventory - Inventory data input properties
   * @param manager - Transaction manager
   * @returns Created inventory
   */
  @Transaction()
  public async create(
    productId: string,
    sellerId: string,
    inventory: Exclude<Inventory, 'product' | 'productId' | 'seller' | 'sellerId'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    const newInventory: Inventory = await manager!.save(
      Inventory,
      manager!.create(Inventory, {
        ...inventory,
        product: { id: productId },
        seller: { id: sellerId },
      }),
    );

    logger.info(`Created inventory ${newInventory.id}`);

    return newInventory;
  }

  /**
   * Read an inventory that matches the id.
   *
   * @param id - Inventory's id
   * @param manager - Transaction manager
   * @returns Inventory found, undefined otherwise
   */
  @Transaction()
  public readOne(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory | undefined> {
    return manager!.findOne(Inventory, id, { cache: true });
  }

  /**
   * Read an inventory that matches the id.
   * If no inventory exists rejects.
   *
   * @param id - Inventory's id
   * @param manager - Transaction manager
   * @returns Inventory found
   */
  @Transaction()
  public readOneOrFail(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    return manager!.findOneOrFail(Inventory, id, { cache: true });
  }

  /**
   * Read multiple inventories.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Inventories found
   */
  @Transaction()
  public read(
    { skip, take, stock }: FindInventoryArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    const quantity = this.stockToQuantity(stock);

    return manager!.find(Inventory, {
      where: {
        ...(quantity && { quantity }),
      },
      skip,
      take,
      order: { condition: 'ASC', price: 'ASC' },
      cache: true,
    });
  }

  /**
   * Read the available inventories of the product identified by the productId.
   *
   * @param productId - Product's id
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Inventories found
   */
  @Transaction()
  public readByProduct(
    productId: string,
    { skip, take, stock }: FindInventoryArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    const quantity = this.stockToQuantity(stock);

    return manager!.find(Inventory, {
      where: { product: { id: productId }, ...(quantity && { quantity }) },
      skip,
      take,
      order: { condition: 'ASC', price: 'ASC' },
    });
  }

  /**
   * Read the available inventories of the seller identified by the sellerId.
   *
   * @param sellerId - Seller's id
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Inventories found
   */
  @Transaction()
  public readBySeller(
    sellerId: string,
    { skip, take, stock }: FindInventoryArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    const quantity = this.stockToQuantity(stock);

    return manager!.find(Inventory, {
      where: { seller: { id: sellerId }, ...(quantity && { quantity }) },
      skip,
      take,
      order: { condition: 'ASC', price: 'ASC' },
    });
  }

  /**
   * Update the inventory identified by the id.
   * Only the seller (identified by sellerId) of the inventory can update it.
   *
   * @param id - Inventory's id
   * @param sellerId - Seller id
   * @param inventory - Inventory update properties
   * @param manager - Transaction manager
   * @returns Updated inventory
   */
  @Transaction()
  public async update(
    id: string,
    sellerId: string,
    inventory: Partial<Omit<Inventory, 'id' | 'product' | 'productId' | 'seller' | 'sellerId'>>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    // Check if inventory exists and the seller matches
    await manager!.findOneOrFail(Inventory, id, { where: { seller: { id: sellerId } } });

    await manager!.update(Inventory, id, manager!.create(Inventory, inventory));

    logger.info(`Updated inventory ${id}`);

    return manager!.findOneOrFail(Inventory, id);
  }

  /**
   * Delete the inventory identified by the id.
   * Only the seller (identified by sellerId) of the inventory can delete it.
   *
   * @param id - Inventory's id
   * @param sellerId - Seller id
   * @param manager - Transaction manager
   * @returns Deleted inventory
   */
  @Transaction()
  public async delete(
    id: string,
    sellerId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    // Check if inventory exists and the seller matches
    const inventory: Inventory = await manager!.findOneOrFail(Inventory, id, {
      where: { seller: { id: sellerId } },
    });

    await manager!.delete(Inventory, id);

    logger.info(`Deleted inventory ${id}`);

    return inventory;
  }

  /**
   * Returns the total quantity of the product.
   *
   * @param productId - Product id
   * @param manager - Transaction manager
   * @returns Total quantity of the product
   */
  @Transaction()
  public async quantityByProduct(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<number> {
    const { quantity }: { quantity: number } = await manager!
      .createQueryBuilder(Inventory, 'inventory')
      .select('COALESCE(SUM(inventory.quantity), 0)', 'quantity')
      .where('inventory.product_id = :productId', { productId })
      .getRawOne();

    return quantity;
  }

  /**
   * Returns the best selling price of the product from the available inventories.
   *
   * @param productId - Product's id
   * @param manager - Transaction manager
   * @returns Best selling price of the product from the available inventories
   */
  @Transaction()
  public async priceByProduct(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<number | undefined> {
    const { price }: { price: number | undefined } = (await manager!
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
