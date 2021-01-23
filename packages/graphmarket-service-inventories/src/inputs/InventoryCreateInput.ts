import { Field, InputType } from 'type-graphql';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Inventory, ProductConditions } from '@graphmarket/entities';

/**
 * Inventory creation input.
 */
@InputType()
export default class InventoryCreateInput implements Partial<Inventory> {
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

  /**
   * Product's condition.
   */
  @Field(() => ProductConditions)
  condition!: ProductConditions;
}
