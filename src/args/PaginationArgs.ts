import { Max, Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '../scalars';

/**
 * Pagination arguments.
 */
@ArgsType()
export default class PaginationArgs {
  /**
   * Default offset from where entities should be taken.
   */
  public static readonly DEFAULT_SKIP: number = 0;

  /**
   * Default limit (max) number of entities that should be taken.
   */
  public static readonly DEFAULT_TAKE: number = 16;

  /**
   * Offset from where entities should be taken.
   *
   * @see PaginationArgs.DEFAULT_SKIP
   */
  @Field(() => GraphQLNonNegativeInt)
  @Min(PaginationArgs.DEFAULT_SKIP)
  skip: number = PaginationArgs.DEFAULT_SKIP;

  /**
   * Limit (max) number of entities that should be taken.
   *
   * @see PaginationArgs.DEFAULT_TAKE
   */
  @Field(() => GraphQLPositiveInt)
  @Max(PaginationArgs.DEFAULT_TAKE)
  take: number = PaginationArgs.DEFAULT_TAKE;
}
