import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import Product from '@app/entities/Product';
import { GraphQLNonEmptyString } from '@app/graphql/scalars';

@InputType()
export default class ProductUpdateInput implements Partial<Product> {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
