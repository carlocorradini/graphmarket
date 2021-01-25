import { Field, InputType } from 'type-graphql';
import { Length, Max, Min } from 'class-validator';
import { GraphQLNonEmptyString, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { Review } from '@graphmarket/entities';

/**
 * Review creation input.
 */
@InputType()
export default class ReviewCreateInput implements Partial<Review> {
  /**
   * Review's title.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  title?: string;

  /**
   * Review's body.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 256)
  body?: string;

  /**
   * Review's rating.
   */
  @Field(() => GraphQLPositiveInt)
  @Min(1)
  @Max(5)
  rating!: number;
}
