import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import Recipe from '@app/entities/Recipe';
import { GraphQLNonEmptyString } from '../scalars';

@InputType()
export default class RecipeCreateInput implements Partial<Recipe> {
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 64)
  name!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
