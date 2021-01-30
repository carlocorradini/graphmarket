import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { ReviewExternal } from '@graphmarket/entities';
import { GraphQLBoolean } from '@graphmarket/graphql-scalars';
import { PurchaseService } from '@app/services';

/**
 * Review purchase resolver.
 *
 * @see PurchaseService
 */
@Resolver(() => ReviewExternal)
@Service()
export default class ReviewPurchaseResolver {
  /**
   * Purchase service.
   */
  @Inject()
  private readonly purchaseService!: PurchaseService;

  /**
   * Resolves if the review is verified.
   * A review is verified if the author has bought the product at least one time.
   *
   * @param review - Review to check if the author has at least one purchases
   * @returns True if verified, false otherwise
   */
  @FieldResolver(() => GraphQLBoolean, {
    description: `Check if the review is verified. A review is verified if the author has bought the product at least one time`,
  })
  verified(@Root() review: ReviewExternal): Promise<boolean> {
    return this.purchaseService.verifiedByReview(review.id);
  }
}
