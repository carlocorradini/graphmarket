import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Inventory from './Inventory';

/**
 * Inventory external entity.
 *
 * @see Inventory
 */
@Directive('@extends')
@Directive(`@key(fields: "id")`)
@ObjectType('Inventory')
export default class InventoryExternal implements Partial<Inventory> {
  /**
   * Inventory's id.
   */
  @Directive('@external')
  @Field(() => GraphQLID)
  id!: string;
}
