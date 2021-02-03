import { AbstractRepository, EntityRepository } from 'typeorm';
import { Product } from '@graphmarket/entities';
import { ProductCreateInput, ProductUpdateInput } from '@app/inputs';
import { FindProductsArgs } from '@app/args';

/**
 * Product repository.
 *
 * @see Product
 */
@EntityRepository(Product)
export default class ProductRepository extends AbstractRepository<Product> {
  /**
   * Enable or disable caching.
   */
  private static readonly cache: boolean = true;

  /**
   * Create a new product.
   *
   * @param product - Product create properties
   * @returns Created product
   */
  public create(product: ProductCreateInput): Promise<Product> {
    return this.manager.save(Product, this.manager.create(Product, product));
  }

  /**
   * Read a product that matches the id.
   *
   * @param id - Product id
   * @returns Product found, undefined otherwise
   */
  public readOneById(id: string): Promise<Product | undefined> {
    return this.manager.findOne(Product, id, { cache: ProductRepository.cache });
  }

  /**
   * Read the product of the inventory.
   *
   * @param inventoryId - Inventory id
   * @returns Product of the inventory, undefined otherwise
   */
  public readOneByInventoryId(inventoryId: string): Promise<Product | undefined> {
    return this.manager
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.inventories', 'inventory')
      .where('inventory.id = :inventoryId', { inventoryId })
      .cache(ProductRepository.cache)
      .getOne();
  }

  /**
   * Read the product of the purchase.
   *
   * @param purchaseId - Purchase id
   * @returns Product of the purchase, undefined otherwise
   */
  public readOneByPurchaseId(purchaseId: string): Promise<Product | undefined> {
    return this.manager
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.inventories', 'inventory')
      .innerJoin('inventory.purchases', 'purchase')
      .where('purchase.id = :purchaseId', { purchaseId })
      .cache(ProductRepository.cache)
      .getOne();
  }

  /**
   * Read the product of the review.
   *
   * @param reviewId - Review id
   * @returns Product of the review, undefined otherwise
   */
  public readOneByReviewId(reviewId: string): Promise<Product | undefined> {
    return this.manager
      .createQueryBuilder(Product, 'product')
      .innerJoin('product.reviews', 'review')
      .where('review.id = :reviewId', { reviewId })
      .cache(ProductRepository.cache)
      .getOneOrFail();
  }

  /**
   * Read mutiple products.
   *
   * @param param0 - Find options
   * @returns Products found
   */
  public read({ skip, take, name }: FindProductsArgs): Promise<Product[]> {
    const query = this.manager.createQueryBuilder(Product, 'product');

    if (name)
      query.where('LOWER(product.name) LIKE :name', { name: `%${name.toLocaleLowerCase()}%` });

    return query.skip(skip).take(take).cache(ProductRepository.cache).getMany();
  }

  /**
   * Update the product.
   *
   * @param id - Product id
   * @param product - Product update properties
   * @returns Updated product
   */
  public async update(
    id: string,
    product: ProductUpdateInput & Partial<Pick<Product, 'photos'>>,
  ): Promise<Product> {
    // Check if product exists
    await this.manager.findOneOrFail(Product, id);

    // Update
    await this.manager.update(Product, id, this.manager.create(Product, product));

    // Return updated product
    return this.manager.findOneOrFail(Product, id);
  }

  /**
   * Delete the product.
   *
   * @param id - Product id
   * @returns Deleted product
   */
  public async delete(id: string): Promise<Product> {
    // Check if product exists
    const product: Product = await this.manager.findOneOrFail(Product, id);

    // Delete
    await this.manager.delete(Product, id);

    // Return deleted product
    return product;
  }
}
