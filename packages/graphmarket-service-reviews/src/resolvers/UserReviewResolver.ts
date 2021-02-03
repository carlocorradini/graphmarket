import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Review, UserExternal } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { ReviewService } from '@app/services';

/**
 * User review resolver.
 *
 * @see ReviewService
 */
@Resolver(() => UserExternal)
@Service()
export default class UserReviewResolver {
  /**
   * Review service.
   */
  @Inject()
  private readonly reviewService!: ReviewService;

  /**
   * Resolves the reviews of the user.
   *
   * @param user - User to obtain the reviews of
   * @param param1 - Pagination arguments
   * @returns Reviews of the user
   */
  @FieldResolver(() => [Review], { description: `User's reviews` })
  reviews(@Root() user: UserExternal, @Args() { skip, take }: PaginationArgs): Promise<Review[]> {
    return this.reviewService.read({ skip, take, authorId: user.id });
  }
}
