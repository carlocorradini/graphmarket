import { GraphQLID } from '@graphmarket/graphql-scalars';
import { Directive, Field, ObjectType } from 'type-graphql';
import User from './User';

/**
 * User external entity.
 *
 * @see User
 */
@Directive('@extends')
@Directive(`@key(fields: "id")`)
@ObjectType('User')
export default class UserExternal implements Partial<User> {
  /**
   * User's id.
   */
  @Directive('@external')
  @Field(() => GraphQLID)
  id!: string;
}
