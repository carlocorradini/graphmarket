import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export default class PaginationArgs {
  public static readonly DEFAULT_SKIP: number = 0;

  public static readonly DEFAULT_TAKE: number = 16;

  @Field(() => Int)
  skip: number = PaginationArgs.DEFAULT_SKIP;

  @Field(() => Int)
  take: number = PaginationArgs.DEFAULT_TAKE;
}
