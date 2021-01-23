import { Field, InputType } from 'type-graphql';
import { GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Purchase } from '@graphmarket/entities';

/**
 * Purchase creation input.
 */
@InputType()
export default class PurchaseCreateInput implements Partial<Purchase> {
  /**
   * Purchase's quantity.
   */
  @Field(() => GraphQLPositiveInt)
  quantity!: number;
}
