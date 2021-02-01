/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Product } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { FindProductsArgs } from '@app/args';

/**
 * Product service.
 *
 * @see Product
 */
@Service()
export default class ProductService {
  /**
   * Create a new product.
   *
   * @param product - Product data input properties
   * @param manager - Transaction manager
   * @returns Created product
   */
  @Transaction()
  public async create(
    product: Product,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const newProduct: Product = await manager!.save(
      Product,
      manager!.create(Product, { ...product }),
    );

    logger.info(`Created product ${newProduct.id}`);

    return newProduct;
  }

  /**
   * Read a product that matches the id.
   *
   * @param id - Product's id
   * @param manager - Transaction manager
   * @returns Product found, undefined otherwise
   */
  @Transaction()
  public readOne(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product | undefined> {
    return manager!.findOne(Product, id, { cache: true });
  }

  /**
   * Read a product that matches the id.
   * If no product exists rejects.
   *
   * @param id - Product's id
   * @param manager - Transaction manager
   * @returns Product found
   */
  @Transaction()
  public readOneOrFail(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    return manager!.findOneOrFail(Product, id, { cache: true });
  }

  /**
   * Read the product of the inventory identified by the inventoryId.
   *
   * @param inventoryId - Inventory id
   * @param manager - Transaction manager
   * @returns Product of the inventory
   */
  @Transaction()
  public readOneByInventory(
    inventoryId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    return manager!
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.inventories', 'inventory')
      .where('inventory.id = :inventoryId', { inventoryId })
      .getOneOrFail();
  }

  /**
   * Read the product of the purchase identified by the purchaseId.
   *
   * @param purchaseId - Purchase id
   * @param manager - Transaction manager
   * @returns Product of the purchase
   */
  @Transaction()
  public readOneByPurchase(
    purchaseId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    return manager!
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.inventories', 'inventory')
      .innerJoin('inventory.purchases', 'purchase')
      .where('purchase.id = :purchaseId', { purchaseId })
      .getOneOrFail();
  }

  /**
   * Read the product of the review identified by the reviewId.
   *
   * @param reviewId - Review id
   * @param manager - Transaction manager
   * @returns Product of the review
   */
  @Transaction()
  public readOneByReview(
    reviewId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    return manager!
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.reviews', 'review')
      .where('review.id = :reviewId', { reviewId })
      .getOneOrFail();
  }

  /**
   * Read multiple products.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Products found
   */
  @Transaction()
  public read(
    { skip, take, name }: FindProductsArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product[]> {
    const query = manager!.createQueryBuilder(Product, 'product');

    if (name)
      query.where('LOWER(product.name) LIKE :name', { name: `%${name.toLocaleLowerCase()}%` });

    return query.skip(skip).take(take).cache(true).getMany();
  }

  /**
   * Update the product identified by the id.
   *
   * @param id - Product's id
   * @param product - Product update properties
   * @param manager - Transaction manager
   * @returns Updated product
   */
  @Transaction()
  public async update(
    id: string,
    product: Partial<Omit<Product, 'id' | 'seller' | 'sellerId'>>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    // Check if product exists
    await manager!.findOneOrFail(Product, id);

    await manager!.update(Product, id, manager!.create(Product, product));

    logger.info(`Updated product ${id}`);

    return manager!.findOneOrFail(Product, id);
  }

  /**
   * Delete the product identified by the id.
   *
   * @param id - Product's id
   * @param manager - Transaction manager
   * @returns Deleted product
   */
  @Transaction()
  public async delete(id: string, @TransactionManager() manager?: EntityManager): Promise<Product> {
    // Check if product exists
    const product: Product = await manager!.findOneOrFail(Product, id);

    await manager!.delete(Product, id);

    logger.info(`Deleted product ${id}`);

    return product;
  }
}
