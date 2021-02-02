import { Max, Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';

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
  @Field(() => GraphQLNonNegativeInt, {
    defaultValue: PaginationArgs.DEFAULT_SKIP,
    description: `Number of items that should be skipped`,
  })
  @Min(PaginationArgs.DEFAULT_SKIP)
  skip: number = PaginationArgs.DEFAULT_SKIP;

  /**
   * Limit (max) number of entities that should be taken.
   *
   * @see PaginationArgs.DEFAULT_TAKE
   */
  @Field(() => GraphQLPositiveInt, {
    defaultValue: PaginationArgs.DEFAULT_TAKE,
    description: `Number of items that should be taken`,
  })
  @Max(PaginationArgs.DEFAULT_TAKE)
  take: number = PaginationArgs.DEFAULT_TAKE;
}
