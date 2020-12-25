import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString } from '@graphmarket/commons';
import Product from '../entities/Product';

/**
 * Product creation input.
 */
@InputType()
export default class ProductCreateInput implements Partial<Product> {
  /**
   * Product's name.
   */
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 128)
  name!: string;

  /**
   * Product's description.
   */
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 256)
  description!: string;
}
