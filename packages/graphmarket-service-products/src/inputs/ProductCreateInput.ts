import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString } from '@graphmarket/graphql-scalars';
import { Product, ProductCategories } from '@graphmarket/entities';

/**
 * Product creation input.
 */
@InputType()
export default class ProductCreateInput implements Partial<Product> {
  /**
   * Product's category.
   */
  @Field(() => ProductCategories)
  category!: ProductCategories;

  /**
   * Product's name.
   */
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 128)
  name!: string;

  /**
   * Product's description.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
