import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString, GraphQLProductRating } from '@graphmarket/graphql-scalars';
import { Review } from '@graphmarket/entities';

/**
 * Review creation input.
 */
@InputType('ReviewCreateInput', { description: `Review create input` })
export default class ReviewCreateInput implements Partial<Review> {
  /**
   * Review's title.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Review's title` })
  @Length(1, 64)
  title?: string;

  /**
   * Review's body.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Review's body` })
  @Length(1, 256)
  body?: string;

  /**
   * Review's rating.
   */
  @Field(() => GraphQLProductRating, { description: `Review's rating` })
  rating!: number;
}
