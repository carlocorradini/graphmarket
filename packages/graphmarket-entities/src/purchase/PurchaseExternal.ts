import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Purchase from './Purchase';

/**
 * Purchase external entity.
 *
 * @see Purchase
 */
@ObjectType('Purchase')
@Directive(`@key(fields: "id")`)
@Directive('@extends')
export default class PurchaseExternal implements Partial<Purchase> {
  /**
   * Purchase's id.
   */
  @Directive('@external')
  @Field(() => GraphQLID)
  id!: string;
}
