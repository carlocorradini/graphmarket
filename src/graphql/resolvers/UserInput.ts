import { Field, InputType } from 'type-graphql';
import { IsEmail, IsEmpty, IsEnum, IsISO8601, IsOptional, IsString, Length } from 'class-validator';
import User, { UserGender } from '@app/entities/User';

export enum UserValidationGroup {
  CREATION = 'CREATION',
  UPDATE = 'UPDATE',
}

@InputType()
export default class UserInput implements Partial<User> {
  @Field()
  @IsString({ groups: [UserValidationGroup.CREATION] })
  @Length(1, 128, { groups: [UserValidationGroup.CREATION] })
  @IsEmpty({ groups: [UserValidationGroup.UPDATE] })
  username?: string;

  @Field()
  @IsString({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @Length(8, 64, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.UPDATE] })
  password?: string;

  @Field({ nullable: true })
  @IsString({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @Length(1, 64, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  name?: string;

  @Field({ nullable: true })
  @IsString({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @Length(1, 64, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  surname?: string;

  @Field(() => UserGender)
  @IsEnum(UserGender, { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  @IsOptional({ groups: [UserValidationGroup.UPDATE] })
  gender?: UserGender;

  @Field({ nullable: true })
  @IsISO8601(
    { strict: true },
    { groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] }
  )
  @IsOptional({ groups: [UserValidationGroup.CREATION, UserValidationGroup.UPDATE] })
  dateOfBirth?: Date;

  @Field()
  @IsEmail(undefined, { groups: [UserValidationGroup.CREATION] })
  @Length(3, 128, { groups: [UserValidationGroup.CREATION] })
  @IsEmpty({ groups: [UserValidationGroup.UPDATE] })
  email?: string;
}
