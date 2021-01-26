import { Field, InputType } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Inventory, ProductConditions } from '@graphmarket/entities';

/**
 * Inventory creation input.
 */
@InputType('InventoryCreateInput', { description: `Inventory create input` })
export default class InventoryCreateInput implements Partial<Inventory> {
  /**
   * Product's price in cents.
   */
  @Field(() => GraphQLPositiveInt, { description: `Product's price in cents` })
  price!: number;

  /**
   * Product's quantity.
   */
  @Field(() => GraphQLNonNegativeInt, { description: `Product's quantity` })
  quantity!: number;

  /**
   * Product's condition.
   */
  @Field(() => ProductConditions, { description: `Product's condition` })
  condition!: ProductConditions;
}
