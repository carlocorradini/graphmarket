import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Review } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { ReviewService } from '@app/services';
import { ReviewCreateInput, ReviewUpdateInput } from '@app/inputs';

/**
 * Review resolver.
 *
 * @see Review
 * @see ReviewService
 */
@Resolver(Review)
@Service()
export default class ReviewResolver {
  /**
   * Review service.
   */
  @Inject()
  private readonly reviewService!: ReviewService;

  /**
   * Create a new review from the given data.
   *
   * @param productId - Product id
   * @param data - Review's data
   * @param ctx - Request context
   * @returns Created review
   */
  @Mutation(() => Review)
  @Authorized()
  createReview(
    @Arg('productId', () => GraphQLUUID) productId: string,
    @Arg('data', () => ReviewCreateInput) data: ReviewCreateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Review> {
    return this.reviewService.create(productId, ctx.user!.id, data as Review);
  }

  /**
   * Resolves the review that match the given id.
   *
   * @param id - Review's id
   * @returns Review that match the id
   */
  @Query(() => Review, { nullable: true })
  review(@Arg('id', () => GraphQLUUID) id: string): Promise<Review | undefined> {
    return this.reviewService.readOne(id);
  }

  /**
   * Resolves all available reviews.
   *
   * @param param0 - Pagination arguments
   * @returns All available reviews
   */
  @Query(() => [Review])
  reviews(@Args() { skip, take }: PaginationArgs): Promise<Review[]> {
    return this.reviewService.read({ skip, take });
  }

  /**
   * Update the review identified by id.
   * Only the author of the review can update it.
   *
   * @param id - Review's id
   * @param data - Review's data
   * @param ctx - Request context
   * @returns Updated review
   */
  @Mutation(() => Review)
  @Authorized()
  updateReview(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data', () => ReviewUpdateInput) data: ReviewUpdateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Review> {
    return this.reviewService.update(id, ctx.user!.id, data);
  }

  /**
   * Delete the review identified by the id.
   * Only the author of the review can delete id.
   *
   * @param id - Review's id
   * @param ctx - Request context
   * @returns Deleted review
   */
  @Mutation(() => Review)
  @Authorized()
  deleteReview(
    @Arg('id', () => GraphQLUUID) id: string,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Review> {
    return this.reviewService.delete(id, ctx.user!.id);
  }
}
