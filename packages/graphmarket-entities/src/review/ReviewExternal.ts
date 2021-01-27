import { Directive, Field, ObjectType } from 'type-graphql';
import { GraphQLID } from '@graphmarket/graphql-scalars';
import Review from './Review';

/**
 * Review external entity.
 *
 * @see Review
 */
@ObjectType('Review')
@Directive(`@key(fields: "id")`)
@Directive('@extends')
export default class ReviewExternal implements Partial<Review> {
  /**
   * Review's id.
   */
  @Field(() => GraphQLID)
  @Directive('@external')
  id!: string;
}
