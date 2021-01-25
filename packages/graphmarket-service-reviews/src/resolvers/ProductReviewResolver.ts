import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { ProductExternal, Review } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { ReviewService } from '@app/services';
import { GraphQLNonNegativeFloat } from '@graphmarket/graphql-scalars';

/**
 * Product review resolver.
 *
 * @see ReviewService
 */
@Resolver(() => ProductExternal)
@Service()
export default class ProductReviewResolver {
  /**
   * Review service.
   */
  @Inject()
  private readonly reviewService!: ReviewService;

  /**
   * Resolves the reviews of the product.
   *
   * @param product - Product to obtain the reviews of
   * @param param1 - Pagination arguments
   * @returns Reviews of the product
   */
  @FieldResolver(() => [Review])
  reviews(
    @Root() product: ProductExternal,
    @Args() { skip, take }: PaginationArgs,
  ): Promise<Review[]> {
    return this.reviewService.readByProduct(product.id, { skip, take });
  }

  /**
   * Resolves the average rating of the product from all reviews.
   * 
   * @param product - Product to obtain the average rating of
   * @returns Average rating of the product
   */
  @FieldResolver(() => GraphQLNonNegativeFloat)
  rating(@Root() product: ProductExternal): Promise<number> {
    return this.reviewService.ratingByProduct(product.id);
  }
}
