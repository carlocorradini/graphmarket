import { Field, InputType } from 'type-graphql';
import { IsEmpty, IsOptional, IsString, Length } from 'class-validator';
import Recipe from '@app/entities/Recipe';

export enum RecipeValidationGroup {
  CREATION = 'CREATION',
  UPDATE = 'UPDATE',
}

@InputType()
export default class RecipeInput implements Partial<Recipe> {
  @Field()
  @IsEmpty({ groups: [RecipeValidationGroup.UPDATE] })
  name?: string;

  @Field({ nullable: true })
  @IsString({ groups: [RecipeValidationGroup.CREATION, RecipeValidationGroup.UPDATE] })
  @Length(1, 256, { groups: [RecipeValidationGroup.CREATION, RecipeValidationGroup.UPDATE] })
  @IsOptional({ groups: [RecipeValidationGroup.CREATION, RecipeValidationGroup.UPDATE] })
  description?: string;
}
