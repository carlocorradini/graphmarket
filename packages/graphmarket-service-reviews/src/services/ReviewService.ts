/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, FindManyOptions, Transaction, TransactionManager } from 'typeorm';
import { Review } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import logger from '@graphmarket/logger';

/**
 * Review service.
 *
 * @see Review
 */
@Service()
export default class ReviewService {
  /**
   * Create a new review.
   *
   * @param productId - Product id
   * @param authorId - Author id
   * @param review - Review data input properties
   * @param manager - Transaction manager
   * @returns Created review
   */
  @Transaction()
  public async create(
    productId: string,
    authorId: string,
    review: Exclude<Review, 'author' | 'authorId' | 'product' | 'productId'>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review> {
    // Check if there is not already a review for the product by the user
    if (
      (await manager!.count(Review, {
        where: { author: { id: authorId }, product: { id: productId } },
      })) !== 0
    ) {
      // TODO Custom error
      throw new Error(`A review for ${productId} already exists`);
    }

    const newReview: Review = await manager!.save(
      Review,
      manager!.create(Review, { ...review, product: { id: productId }, author: { id: authorId } }),
    );

    logger.info(`Created review ${newReview.id}`);

    return newReview;
  }

  /**
   * Read a review that matches the id.
   *
   * @param id - Review's id
   * @param manager - Transaction manager
   * @returns Review found, undefined otherwise
   */
  @Transaction()
  public readOne(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review | undefined> {
    return manager!.findOne(Review, id, { cache: true });
  }

  /**
   * Read a review that matches the id.
   * If no review exists rejects.
   *
   * @param id - Review's id
   * @param manager - Transaction manager
   * @returns Review found
   */
  @Transaction()
  public readOneOrFail(id: string, @TransactionManager() manager?: EntityManager): Promise<Review> {
    return manager!.findOneOrFail(Review, id, { cache: true });
  }

  /**
   * Read multiple reviews.
   *
   * @param options - Find options
   * @param manager - Transaction manager
   * @returns Reviews found
   */
  @Transaction()
  public read(
    options: Pick<FindManyOptions, 'skip' | 'take'> = {
      skip: PaginationArgs.DEFAULT_SKIP,
      take: PaginationArgs.DEFAULT_TAKE,
    },
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review[]> {
    return manager!.find(Review, { ...options, cache: true });
  }

  /**
   * Read the available reviews of the product identified by the productId.
   *
   * @param productId - Product's id
   * @param manager - Transaction manager
   * @returns Reviews found
   */
  @Transaction()
  public readByProduct(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review[]> {
    return manager!.find(Review, { where: { product: { id: productId } } });
  }

  /**
   * Read the available reviews of the author identified by the authorId.
   *
   * @param authorId - Author's id
   * @param manager - Transaction manager
   * @returns Reviews found
   */
  @Transaction()
  public readBySeller(
    authorId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review[]> {
    return manager!.find(Review, { where: { author: { id: authorId } } });
  }

  /**
   * Update the review identified by the id.
   * Only the author (identified by authorId) of the review can update it.
   *
   * @param id - Review's id
   * @param authorId - Author id
   * @param review - Review update properties
   * @param manager - Transaction manager
   * @returns Updated review
   */
  @Transaction()
  public async update(
    id: string,
    authorId: string,
    review: Partial<Omit<Review, 'id' | 'author' | 'authorId' | 'product' | 'productId'>>,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review> {
    // Check if review exists and the author matches
    await manager!.findOneOrFail(Review, id, { where: { author: { id: authorId } } });

    await manager!.update(Review, id, manager!.create(Review, review));

    logger.info(`Updated review ${id}`);

    return manager!.findOneOrFail(Review, id);
  }

  /**
   * Delete the review identified by the id.
   * Only the author (identified by authorId) of the review can delete it.
   *
   * @param id - Review's id
   * @param authorId - Author id
   * @param manager - Transaction manager
   * @returns Deleted review
   */
  @Transaction()
  public async delete(
    id: string,
    authorId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review> {
    // Check if review exists and the author matches
    const review: Review = await manager!.findOneOrFail(Review, id, {
      where: { author: { id: authorId } },
    });

    await manager!.delete(Review, id);

    logger.info(`Deleted review ${id}`);

    return review;
  }
}
