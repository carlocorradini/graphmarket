/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Review } from '@graphmarket/entities';
import logger from '@graphmarket/logger';
import { AuthorizationError } from '@graphmarket/errors';
import { FindReviewsArgs } from '@app/args';
import { ReviewRepository } from '@app/repositories';
import { ReviewCreateInput, ReviewUpdateInput } from '@app/inputs';

/**
 * Review service.
 *
 * @see Review
 * @see ReviewRepository
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
    review: ReviewCreateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review> {
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    const newReview: Review = await reviewRepository.create(productId, authorId, review);

    logger.info(`Created review ${newReview.id}`);

    return newReview;
  }

  /**
   * Read a review that matches the id.
   *
   * @param id - Review id
   * @param manager - Transaction manager
   * @returns Review found, undefined otherwise
   */
  @Transaction()
  public readOneById(
    id: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review | undefined> {
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    return reviewRepository.readOneById(id);
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
    options: FindReviewsArgs,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review[]> {
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    return reviewRepository.read(options);
  }

  /**
   * Update the review.
   * Only the author of the review can update it.
   *
   * @param id - Review id
   * @param authorId - Author id
   * @param review - Review update properties
   * @param manager - Transaction manager
   * @returns Updated review
   */
  @Transaction()
  public async update(
    id: string,
    authorId: string,
    review: ReviewUpdateInput,
    @TransactionManager() manager?: EntityManager,
  ): Promise<Review> {
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    // Check if review's author matches
    const reviewToCheck: Review | undefined = await reviewRepository.readOneById(id);
    if (reviewToCheck?.authorId !== authorId) throw new AuthorizationError();

    // Update review
    const reviewUpdated: Review = await reviewRepository.update(id, review);

    logger.info(`Updated review ${id}`);

    return reviewUpdated;
  }

  /**
   * Delete the review.
   * Only the author of the review can delete it.
   *
   * @param id - Review id
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
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    // Check if review's author matches
    const reviewToCheck: Review | undefined = await reviewRepository.readOneById(id);
    if (reviewToCheck?.authorId !== authorId) throw new AuthorizationError();

    // Delete review
    const review = await reviewRepository.delete(id);

    logger.info(`Deleted review ${id}`);

    return review;
  }

  /**
   * Returns the average rating of the product.
   *
   * @param productId - Product id
   * @param manager - Transaction manager
   * @returns Average rating of the product
   */
  @Transaction()
  public productAverageRating(
    productId: string,
    @TransactionManager() manager?: EntityManager,
  ): Promise<number> {
    const reviewRepository: ReviewRepository = manager!.getCustomRepository(ReviewRepository);

    return reviewRepository.productAverageRating(productId);
  }
}
