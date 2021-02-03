import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';

/**
 * Find purchases arguments.
 */
@ArgsType()
export default class FindPurchasesArgs extends PaginationArgs {
  /**
   * User identifier.
   */
  @Field(() => GraphQLUUID, { nullable: true, description: `User identifier` })
  userId?: string;

  /**
   * Inventory identifier.
   */
  @Field(() => GraphQLUUID, { nullable: true, description: `Inventory identifier` })
  inventoryId?: string;
}
