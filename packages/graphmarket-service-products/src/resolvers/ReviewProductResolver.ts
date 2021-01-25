import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { ReviewExternal, Product } from '@graphmarket/entities';
import { ProductService } from '@app/services';

/**
 * Review product resolver.
 *
 * @see ProductService
 */
@Resolver(() => ReviewExternal)
@Service()
export default class ReviewProductResolver {
  /**
   * Product service.
   */
  @Inject()
  private readonly productService!: ProductService;

  /**
   * Resolves the product of a review.
   *
   * @param review - Review to obtain the product of
   * @returns Product of the review
   */
  @FieldResolver(() => Product, { description: `Review's product` })
  product(@Root() review: ReviewExternal): Promise<Product> {
    return this.productService.readOneByReview(review.id);
  }
}
