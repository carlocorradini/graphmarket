import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import User, { UserGenders } from '@app/entities/User';
import { GraphQLDate, GraphQLEmailAddress, GraphQLNonEmptyString } from '../scalars';

/**
 * User creation input.
 */
@InputType()
export default class UserCreateInput implements Partial<User> {
  /**
   * User's username.
   */
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 64)
  username!: string;

  /**
   * User's password.
   */
  @Field(() => GraphQLNonEmptyString)
  @Length(8, 64)
  password!: string;

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
   * User's gender.
   */
  @Field(() => UserGenders)
  gender!: UserGenders;

  /**
   * User's date of birth.
   */
  @Field(() => GraphQLDate, { nullable: true })
  dateOfBirth?: Date;

  /**
   * User's email.
   */
  @Field(() => GraphQLEmailAddress)
  email!: string;
}
