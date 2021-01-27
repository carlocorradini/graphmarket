import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Inventory from './Inventory';

/**
 * Inventory external entity.
 *
 * @see Inventory
 */
@ObjectType('Inventory')
@Directive(`@key(fields: "id")`)
@Directive('@extends')
export default class InventoryExternal implements Partial<Inventory> {
  /**
   * Inventory's id.
   */
  @Field(() => GraphQLID)
  @Directive('@external')
  id!: string;
}
