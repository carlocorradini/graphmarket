import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import Product from '@app/entities/Product';
import { GraphQLNonEmptyString } from '../scalars';

@InputType()
export default class ProductCreateInput implements Partial<Product> {
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 64)
  name!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
