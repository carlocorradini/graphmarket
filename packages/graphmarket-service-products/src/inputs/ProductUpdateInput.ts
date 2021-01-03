import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Product, ProductCategories } from '@graphmarket/entities';

/**
 * Product update input.
 */
@InputType()
export default class ProductUpdateInput implements Partial<Product> {
  /**
   * Product's category.
   */
  @Field(() => ProductCategories, { nullable: true })
  category?: ProductCategories;

  /**
   * Product's name.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 128)
  name?: string;

  /**
   * Product's description.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;

  /**
   * Product's price in cents.
   */
  @Field(() => GraphQLPositiveInt, { nullable: true })
  price?: number;
}
