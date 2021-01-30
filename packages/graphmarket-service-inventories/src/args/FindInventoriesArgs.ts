import { ArgsType, Field, registerEnumType } from 'type-graphql';
import { PaginationArgs } from '@graphmarket/graphql-args';

/**
 * Inventory stock.
 */
export enum InventoryStock {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

registerEnumType(InventoryStock, {
  name: 'InventoryStock',
  description: `Inventory stock`,
});

/**
 * Find inventory arguments.
 */
@ArgsType()
export default class FindInventoryArgs extends PaginationArgs {
  /**
   * Inventory stock.
   */
  @Field(() => InventoryStock, { nullable: true, description: `Stock inventory` })
  stock?: InventoryStock;
}
