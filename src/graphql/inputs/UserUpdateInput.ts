import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '@app/entities';
import { GraphQLDate, GraphQLNonEmptyString } from '../scalars';

/**
 * User update input.
 */
@InputType()
export default class UserUpdateInput implements Partial<User> {
  /**
   * User's password
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(8, 64)
  password?: string;

  /**
   * User's name.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  /**
   * User's surname.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  surname?: string;

  /**
   * User's date of birth.
   */
  @Field(() => GraphQLDate, { nullable: true })
  dateOfBirth?: Date;
}
