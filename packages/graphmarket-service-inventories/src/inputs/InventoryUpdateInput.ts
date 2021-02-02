import { Field, InputType } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Inventory } from '@graphmarket/entities';

/**
 * Inventory update input.
 */
@InputType('InventoryUpdateInput', { description: `Inventory update input` })
export default class InventoryUpdateInput implements Partial<Inventory> {
  /**
   * Product's price in cents.
   */
  @Field(() => GraphQLPositiveInt, { nullable: true, description: `Product's price in cents` })
  price?: number;

  /**
   * Product's quantity.
   */
  @Field(() => GraphQLNonNegativeInt, { nullable: true, description: `Product's quantity` })
  quantity?: number;
}
