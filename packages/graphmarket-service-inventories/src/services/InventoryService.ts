/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Inventory } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { AuthorizationError } from '@graphmarket/errors';
import { FindInventoriesArgs } from '@app/args';
import { InventoryCreateInput, InventoryUpdateInput } from '@app/inputs';
import { InventoryRepository } from '@app/repositories';

/**
 * Inventory service.
 *
 * @see Inventory
 * @see InventoryRepository
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
    inventory: InventoryCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    const newInventory: Inventory = await inventoryRepository.create(
      productId,
      sellerId,
      inventory,
    );

    logger.info(`Created inventory ${newInventory.id}`);

    return newInventory;
  }

  /**
   * Read an inventory that matches the id.
   *
   * @param id - Inventory id
   * @param manager - Transaction manager
   * @returns Inventory found, undefined otherwise
   */
  @Transaction()
  public readOneById(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory | undefined> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    return inventoryRepository.readOneById(id);
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
    options: FindInventoriesArgs & { productId?: string; sellerId?: string },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory[]> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    return inventoryRepository.read(options);
  }

  /**
   * Update the inventory.
   * Only the seller of the inventory can update it.
   *
   * @param id - Inventory id
   * @param sellerId - Seller id
   * @param inventory - Inventory update properties
   * @param manager - Transaction manager
   * @returns Updated inventory
   */
  @Transaction()
  public async update(
    id: string,
    sellerId: string,
    inventory: InventoryUpdateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Inventory> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    // Check if inventories's seller matches
    const inventoryToCheck: Inventory | undefined = await inventoryRepository.readOneById(id);
    if (inventoryToCheck?.sellerId !== sellerId) throw new AuthorizationError();

    // Update inventory
    const inventoryUpdated: Inventory = await inventoryRepository.update(id, inventory);

    logger.info(`Updated inventory ${id}`);

    return inventoryUpdated;
  }

  /**
   * Delete the inventory.
   * Only the seller of the inventory can delete it.
   *
   * @param id - Inventory id
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
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    // Check if inventories's seller matches
    const inventoryToCheck: Inventory | undefined = await inventoryRepository.readOneById(id);
    if (inventoryToCheck?.sellerId !== sellerId) throw new AuthorizationError();

    // Delete inventory
    const inventory: Inventory = await inventoryRepository.delete(id);

    logger.info(`Deleted inventory ${id}`);

    return inventory;
  }

  /**
   * Returns the total quantity of the product in the inventories.
   *
   * @param productId - Product id
   * @param manager - Transaction manager
   * @returns Total quantity of the product
   */
  @Transaction()
  public async productTotalQuantity(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<number> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    return inventoryRepository.productTotalQuantity(productId);
  }

  /**
   * Returns the best product's selling price in the inventories.
   *
   * @param productId - Product id
   * @param manager - Transaction manager
   * @returns Best product's selling price, undefined otherwise
   */
  @Transaction()
  public async bestProductPrice(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<number | undefined> {
    const inventoryRepository: InventoryRepository = manager!.getCustomRepository(
      InventoryRepository,
    );

    return inventoryRepository.bestProductPrice(productId);
  }
}
