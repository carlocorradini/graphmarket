import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Product from './Product';

/**
 * Product external entity.
 *
 * @see Product
 */
@Directive('@extends')
@Directive(`@key(fields: "id")`)
@ObjectType('Product')
export default class ProductExternal implements Partial<Product> {
  /**
   * Product's id.
   */
  @Directive('@external')
  @Field(() => GraphQLID)
  id!: string;
}
