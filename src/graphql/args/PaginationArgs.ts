import { Max } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '../scalars';

@ArgsType()
export default class PaginationArgs {
  public static readonly DEFAULT_SKIP: number = 0;

  public static readonly DEFAULT_TAKE: number = 16;

  @Field(() => GraphQLNonNegativeInt)
  skip: number = PaginationArgs.DEFAULT_SKIP;

  @Field(() => GraphQLPositiveInt)
  @Max(PaginationArgs.DEFAULT_TAKE)
  take: number = PaginationArgs.DEFAULT_TAKE;
}
