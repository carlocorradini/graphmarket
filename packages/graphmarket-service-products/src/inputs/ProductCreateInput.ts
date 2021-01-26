import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString } from '@graphmarket/graphql-scalars';
import { Product, ProductCategories } from '@graphmarket/entities';

/**
 * Product creation input.
 */
@InputType('ProductCreateInput', { description: `Product create input` })
export default class ProductCreateInput implements Partial<Product> {
  /**
   * Product's category.
   */
  @Field(() => ProductCategories, { description: `Product's category` })
  category!: ProductCategories;

  /**
   * Product's name.
   */
  @Field(() => GraphQLNonEmptyString, { description: `Product's name` })
  @Length(1, 128)
  name!: string;

  /**
   * Product's description.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Product's description` })
  @Length(1, 256)
  description?: string;
}
