import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import User, { UserGenders } from '@app/entities/User';
import { GraphQLDate, GraphQLEmailAddress, GraphQLNonEmptyString } from '../scalars';

@InputType()
export default class UserCreateInput implements Partial<User> {
  @Field(() => GraphQLNonEmptyString)
  @Length(1, 64)
  username!: string;

  @Field(() => GraphQLNonEmptyString)
  @Length(8, 64)
  password!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  surname?: string;

  @Field(() => UserGenders)
  gender!: UserGenders;

  @Field(() => GraphQLDate, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => GraphQLEmailAddress)
  email!: string;
}
