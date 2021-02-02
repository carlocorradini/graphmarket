import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLNonEmptyString } from '@graphmarket/graphql-scalars';

/**
 * Find products arguments.
 */
@ArgsType()
export default class FindProductsArgs extends PaginationArgs {
  /**
   * Product name.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Product name query` })
  name?: string;
}
