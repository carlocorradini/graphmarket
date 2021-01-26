import { Field, InputType } from 'type-graphql';
import { Length, MaxDate } from 'class-validator';
import { GraphQLDate, GraphQLNonEmptyString } from '@graphmarket/graphql-scalars';
import { User, UserGenders } from '@graphmarket/entities';

/**
 * User update input.
 */
@InputType('UserUpdateInput', { description: `User update input` })
export default class UserUpdateInput implements Partial<User> {
  /**
   * User's password
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `User's password` })
  @Length(8, 64)
  password?: string;

  /**
   * User's name.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `User's name` })
  @Length(1, 64)
  name?: string;

  /**
   * User's surname.
   */
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `User's surname` })
  @Length(1, 64)
  surname?: string;

  /**
   * User's gender.
   */
  @Field(() => UserGenders, { nullable: true, description: `User's gender` })
  gender?: UserGenders;

  /**
   * User's date of birth.
   */
  @Field(() => GraphQLDate, { nullable: true, description: `User's date of birth` })
  @MaxDate(new Date())
  dateOfBirth?: Date;
}
