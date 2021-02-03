/* eslint-disable class-methods-use-this */
import { ReadStream } from 'fs';
import { Inject, Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Product } from '@graphmarket/entities';
import { UploadAdapter } from '@graphmarket/adapters';
import logger from '@graphmarket/logger';
import { FindProductsArgs } from '@app/args';
import config from '@app/config';
import { ProductRepository } from '@app/repositories';
import { ProductCreateInput, ProductUpdateInput } from '@app/inputs';

/**
 * Product service.
 *
 * @see Product
 * @see ProductRepository
 */
@Service()
export default class ProductService {
  /**
   * Upload adapter instance.
   */
  @Inject()
  private readonly uploadAdapter!: UploadAdapter;

  /**
   * Create a new product.
   *
   * @param product - Product data input properties
   * @param manager - Transaction manager
   * @returns Created product
   */
  @Transaction()
  public async create(
    product: ProductCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    const newProduct: Product = await productRepository.create(product);

    logger.info(`Created product ${newProduct.id}`);

    return newProduct;
  }

  /**
   * Read a product that matches the id.
   *
   * @param id - Product id
   * @param manager - Transaction manager
   * @returns Product found, undefined otherwise
   */
  @Transaction()
  public readOneById(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product | undefined> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    return productRepository.readOneById(id);
  }

  /**
   * Read the product of the inventory.
   *
   * @param inventoryId - Inventory id
   * @param manager - Transaction manager
   * @returns Product of the inventory, undefined otherwise
   */
  @Transaction()
  public readOneByInventoryId(
    inventoryId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product | undefined> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    return productRepository.readOneByInventoryId(inventoryId);
  }

  /**
   * Read the product of the purchase.
   *
   * @param purchaseId - Purchase id
   * @param manager - Transaction manager
   * @returns Product of the purchase, undefined otherwise
   */
  @Transaction()
  public readOneByPurchaseId(
    purchaseId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product | undefined> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    return productRepository.readOneByPurchaseId(purchaseId);
  }

  /**
   * Read the product of the review.
   *
   * @param reviewId - Review id
   * @param manager - Transaction manager
   * @returns Product of the review, undefined otherwise
   */
  @Transaction()
  public readOneByReviewId(
    reviewId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product | undefined> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    return productRepository.readOneByReviewId(reviewId);
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
    options: FindProductsArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product[]> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    return productRepository.read(options);
  }

  /**
   * Update the product.
   *
   * @param id - Product id
   * @param product - Product update properties
   * @param manager - Transaction manager
   * @returns Updated product
   */
  @Transaction()
  public async update(
    id: string,
    product: ProductUpdateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    // Update product
    const productUpdated: Product = await productRepository.update(id, product);

    logger.info(`Updated product ${id}`);

    return productUpdated;
  }

  /**
   * Update the photos of the product.
   *
   * @param id - Product id
   * @param photo - Photo stream
   * @param manager - Transaction manager
   * @returns Updated product
   * @see UploadAdapter
   */
  @Transaction()
  public async updatePhoto(
    id: string,
    photo: ReadStream,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Product> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    // Obtain product's photos
    let photos: string[] = (await productRepository.readOneById(id))?.photos || [];

    // Upload photo and extract generated url
    const photoUrl: string = (
      await this.uploadAdapter.upload({ resource: photo, type: 'PRODUCT_PHOTO' })
    ).secure_url;

    // Rotate
    photos = [photoUrl, ...photos];
    photos.slice(0, config.ADAPTERS.UPLOAD.MAX_FILES);

    // Update photos
    const product: Product = await productRepository.update(id, { photos });

    logger.info(`Updated product ${id}`);

    return product;
  }

  /**
   * Delete the product.
   *
   * @param id - Product id
   * @param manager - Transaction manager
   * @returns Deleted product
   */
  @Transaction()
  public async delete(id: string, @TransactionManager() manager?: EntityManager): Promise<Product> {
    const productRepository: ProductRepository = manager!.getCustomRepository(ProductRepository);

    // Delete product
    const product: Product = await productRepository.delete(id);

    logger.info(`Deleted product ${id}`);

    return product;
  }
}
