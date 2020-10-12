import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '@app/entities';
import { GraphQLDate, GraphQLNonEmptyString } from '../scalars';

@InputType()
export default class UserUpdateInput implements Partial<User> {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(8, 64)
  password?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  @Length(1, 64)
  surname?: string;

  @Field(() => GraphQLDate, { nullable: true })
  dateOfBirth?: Date;
}
