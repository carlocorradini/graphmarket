import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import Product from '@app/entities/Product';
import { GraphQLNonEmptyString, GraphQLPositiveInt } from '../scalars';

@InputType()
export default class ProductUpdateInput implements Partial<Product> {
  @Field(() => GraphQLPositiveInt)
  id!: number;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
