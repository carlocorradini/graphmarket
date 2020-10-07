import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import Recipe from '@app/entities/Recipe';
import { GraphQLNonEmptyString, GraphQLPositiveInt } from '../scalars';

@InputType()
export default class RecipeUpdateInput implements Partial<Recipe> {
  @Field(() => GraphQLPositiveInt)
  id!: number;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  description?: string;
}
