/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { Product } from '@graphmarket/entities';
import logger from '@graphmarket/logger';

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
    sellerId: string,
    product: Exclude<Product, 'seller' | 'sellerId'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const newProduct: Product = await manager!.save(
      Product,
      manager!.create(Product, { ...product, seller: { id: sellerId } }),
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
   * Read multiple products.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Products found
   */
  @Transaction()
  public read(
    options?: Pick<FindManyOptions, 'skip' | 'take'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product[]> {
    return manager!.find(Product, { ...options, cache: true });
  }

  /**
   * Read mutiple products for sale of the seller identified by the sellerId.
   *
   * @param sellerId - Seller id
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Products for sale of the seller found
   */
  @Transaction()
  public readforSale(
    sellerId: string,
    options?: Pick<FindManyOptions, 'skip' | 'take'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product[]> {
    return manager!.find(Product, { ...options, where: { seller: { id: sellerId } }, cache: true });
  }
}
