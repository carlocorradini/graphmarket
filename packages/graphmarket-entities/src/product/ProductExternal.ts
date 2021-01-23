import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Product from './Product';

/**
 * Product external entity.
 *
 * @see Product
 */
@ObjectType('Product')
@Directive(`@key(fields: "id")`)
@Directive('@extends')
export default class ProductExternal implements Partial<Product> {
  /**
   * Product's id.
   */
  @Directive('@external')
  @Field(() => GraphQLID)
  id!: string;
}
