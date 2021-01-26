import { Field, InputType } from 'type-graphql';
import { IsPhoneNumber, Length, MaxDate } from 'class-validator';
import {
  GraphQLDate,
  GraphQLEmailAddress,
  GraphQLNonEmptyString,
  GraphQLPhoneNumber,
} from '@graphmarket/graphql-scalars';
import { User, UserGenders } from '@graphmarket/entities';

/**
 * User creation input.
 */
@InputType('UserCreateInput', { description: `User create input` })
export default class UserCreateInput implements Partial<User> {
  /**
   * User's username.
   */
  @Field(() => GraphQLNonEmptyString, { description: `User's username` })
  @Length(1, 64)
  username!: string;

  /**
   * User's password.
   */
  @Field(() => GraphQLNonEmptyString, { description: `User's password` })
  @Length(8, 64)
  password!: string;

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

  /**
   * User's email.
   */
  @Field(() => GraphQLEmailAddress, { description: `User's email` })
  email!: string;

  /**
   * User's phone.
   */
  @Field(() => GraphQLPhoneNumber, { description: `User's phone number` })
  @IsPhoneNumber(null)
  phone!: string;
}
