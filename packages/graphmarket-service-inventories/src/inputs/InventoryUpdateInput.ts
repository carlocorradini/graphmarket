import { Field, InputType } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Inventory } from '@graphmarket/entities';

/**
 * Inventory update input.
 */
@InputType()
export default class InventoryUpdateInput implements Partial<Inventory> {
  /**
   * Product's price in cents.
   */
  @Field(() => GraphQLPositiveInt)
  price!: number;

  /**
   * Product's quantity.
   */
  @Field(() => GraphQLNonNegativeInt)
  quantity!: number;
}
