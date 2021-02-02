import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';

/**
 * Find reviews arguments.
 */
@ArgsType()
export default class FindReviewsArgs extends PaginationArgs {
  /**
   * Author identifier.
   */
  @Field(() => GraphQLUUID, { nullable: true, description: `Author identifier` })
  authorId?: string;

  /**
   * Product identifier.
   */
  @Field(() => GraphQLUUID, { nullable: true, description: `Product identifier` })
  productId?: string;
}
