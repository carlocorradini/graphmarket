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
  @Field(() => UserGenders, { nullable: true })
  gender?: UserGenders;

  /**
   * User's date of birth.
   */
  @Field(() => GraphQLDate, { nullable: true })
  @MaxDate(new Date())
  dateOfBirth?: Date;

  /**
   * User's email.
   */
  @Field(() => GraphQLEmailAddress)
  email!: string;

  /**
   * User's phone.
   */
  @Field(() => GraphQLPhoneNumber)
  @IsPhoneNumber(null)
  phone!: string;
}
