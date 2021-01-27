/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { Inventory } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import logger from '@graphmarket/logger';

/**
 * Inventory service.
 *
 * @see Inventory
 */
@Service()
export default class InventoryService {
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
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    return manager!.find(Inventory, { ...options, cache: true });
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
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    return manager!.find(Inventory, { ...options, where: { product: { id: productId } } });
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
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    return manager!.find(Inventory, { ...options, where: { seller: { id: sellerId } } });
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
}
