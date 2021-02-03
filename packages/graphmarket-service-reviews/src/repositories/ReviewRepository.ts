import { AbstractRepository, EntityRepository } from 'typeorm';
import { Review } from '@graphmarket/entities';
import { EntityAlreadyExistsError } from '@graphmarket/errors';
import { ReviewCreateInput, ReviewUpdateInput } from '@app/inputs';
import { FindReviewsArgs } from '@app/args';

/**
 * Review repository.
 *
 * @see Review
 */
@EntityRepository(Review)
export default class ReviewRepository extends AbstractRepository<Review> {
  /**
   * Enable or disable caching.
   */
  private static readonly cache: boolean = true;

  /**
   * Create a new review.
   *
   * @param productId - Product id
   * @param authorId - Author id
   * @param review - Create create properties
   * @returns Created review
   * @throws EntityAlreadyExistsError If a review already exists
   */
  public async create(
    productId: string,
    authorId: string,
    review: ReviewCreateInput,
  ): Promise<Review> {
    // Count review of the product made by the author
    const count: number = await this.manager.count(Review, {
      where: { author: { id: authorId }, product: { id: productId } },
    });

    // If count is not 0 a review already exists
    if (count !== 0) throw new EntityAlreadyExistsError();

    // Save review
    return this.manager.save(
      Review,
      this.manager.create(Review, {
        ...review,
        product: { id: productId },
        author: { id: authorId },
      }),
    );
  }

  /**
   * Read a review that matches the id.
   *
   * @param id - Review id
   * @returns Review found, undefined otherwise
   */
  public readOneById(id: string): Promise<Review | undefined> {
    return this.manager.findOne(Review, id, { cache: ReviewRepository.cache });
  }

  /**
   * Read mutiple reviews.
   *
   * @param param0 - Find options
   * @returns Reviews found
   */
  public read({ skip, take, authorId, productId }: FindReviewsArgs): Promise<Review[]> {
    return this.manager.find(Review, {
      where: {
        ...(authorId && { author: { id: authorId } }),
        ...(productId && { product: { id: productId } }),
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      cache: ReviewRepository.cache,
    });
  }

  /**
   * Update the review.
   *
   * @param id - Review id
   * @param review - Review update properties
   * @returns Updated review
   */
  public async update(id: string, review: ReviewUpdateInput): Promise<Review> {
    // Check if review exists
    await this.manager.findOneOrFail(Review, id);

    // Update
    await this.manager.update(Review, id, this.manager.create(Review, review));

    // Return updated review
    return this.manager.findOneOrFail(Review, id);
  }

  /**
   * Delete the review.
   *
   * @param id - Review id
   * @returns Deleted review
   */
  public async delete(id: string): Promise<Review> {
    // Check if review exists
    const review: Review = await this.manager.findOneOrFail(Review, id);

    // Delete
    await this.manager.delete(Review, id);

    // Return deleted review
    return review;
  }

  /**
   * Returns the average rating of the product.
   *
   * @param productId - Product id
   * @returns Average rating of the product
   */
  public async productAverageRating(productId: string): Promise<number> {
    const { rating }: { rating: number } = await this.manager
      .createQueryBuilder(Review, 'review')
      .select('ROUND(COALESCE(AVG(review.rating), 0) * 2, 0) / 2', 'rating')
      .where('review.product_id = :productId', { productId })
      .getRawOne();

    return rating;
  }
}
