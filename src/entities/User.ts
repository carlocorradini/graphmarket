import _ from 'lodash';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  GraphQLNonEmptyString,
  GraphQLDate,
  GraphQLDateTime,
  GraphQLEmailAddress,
} from '@app/graphql/scalars';
import { CryptUtil } from '@app/util';

/**
 * User genders.
 */
export enum UserGenders {
  AGENDER = 'AGENDER',
  ANDROGYNE = 'ANDROGYNE',
  ANDROGYNOUS = 'ANDROGYNOUS',
  ASEXUAL = 'ASEXUAL',
  BIGENDER = 'BIGENDER',
  CIS = 'CIS',
  CISGENDER = 'CISGENDER',
  CISGENDER_FEMALE = 'CISGENDER_FEMALE',
  CISGENDER_MALE = 'CISGENDER_MALE',
  CISGENDER_MAN = 'CISGENDER_MAN',
  CISGENDER_WOMAN = 'CISGENDER_WOMAN',
  CIS_FEMALE = 'CIS_FEMALE',
  CIS_MALE = 'CIS_MALE',
  CIS_MAN = 'CIS_MAN',
  CIS_WOMAN = 'CIS_WOMAN',
  F2M = 'F2M',
  FEMALE = 'FEMALE',
  FEMALE_TO_MALE = 'FEMALE_TO_MALE',
  FEMALE_TO_MALE_TRANSGENDER_MAN = 'FEMALE_TO_MALE_TRANSGENDER_MAN',
  FEMALE_TO_MALE_TRANSSEXUAL_MAN = 'FEMALE_TO_MALE_TRANSSEXUAL_MAN',
  FEMALE_TO_MALE_TRANS_MAN = 'FEMALE_TO_MALE_TRANS_MAN',
  FTM = 'FTM',
  GENDERQUEEN = 'GENDERQUEEN',
  GENDER_FLUID = 'GENDER_FLUID',
  GENDER_NEUTRAL = 'GENDER_NEUTRAL',
  GENDER_NONCONFORMING = 'GENDER_NONCONFORMING',
  GENDER_QUESTIONING = 'GENDER_NONCONFORMING',
  GENDER_VARIANT = 'GENDER_VARIANT',
  HERMAPHRODITE = 'HERMAPHRODITE',
  INTERSEX = 'INTERSEX',
  INTERSEX_MAN = 'INTERSEX_MAN',
  INTERSEX_PERSON = 'INTERSEX_PERSON',
  INTERSEX_WOMAN = 'INTERSEX_WOMAN',
  M2F = 'M2F',
  MALE = 'MALE',
  MALE_TO_FEMALE = 'MALE_TO_FEMALE',
  MALE_TO_FEMALE_TRANSGENDER_WOMAN = 'MALE_TO_FEMALE_TRANSGENDER_WOMAN',
  MALE_TO_FEMALE_TRANSSEXUAL_WOMAN = 'MALE_TO_FEMALE_TRANSSEXUAL_WOMAN',
  MALE_TO_FEMALE_TRANS_WOMAN = 'MALE_TO_FEMALE_TRANS_WOMAN',
  MAN = 'MAN',
  MTF = 'MTF',
  NEITHER = 'NEITHER',
  NEUTROIS = 'NEUTROIS',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
  PANGENDER = 'PANGENDER',
  POLYGENDER = 'POLYGENDER',
  TRANS = 'TRANS',
  TRANSEXUAL = 'TRANSEXUAL',
  TRANSEXUAL_FEMALE = 'TRANSEXUAL_FEMALE',
  TRANSEXUAL_MALE = 'TRANSEXUAL_MALE',
  TRANSEXUAL_MAN = 'TRANSEXUAL_MAN',
  TRANSEXUAL_PERSON = 'TRANSEXUAL_PERSON',
  TRANSEXUAL_WOMAN = 'TRANSEXUAL_WOMAN',
  TRANSGENDER_FEMALE = 'TRANSGENDER_FEMALE',
  TRANSGENDER_PERSON = 'TRANSGENDER_PERSON',
  TRANSMASCULINE = 'TRANSMASCULINE',
  TRANS_FEMALE = 'TRANS_FEMALE',
  TRANS_MALE = 'TRANS_MALE',
  TRANS_MAN = 'TRANS_MAN',
  TRANS_PERSON = 'TRABS_PERSON',
  TRANS_STAR_FEMALE = 'TRANS_STAR_FEMALE',
  TRANS_STAR_MALE = 'TRANS_STAR_MALE',
  TRANS_STAR_MAN = 'TRANS_STAR_MAN',
  TRANS_STAR_PERSON = 'TRANS_STAR_PERSON',
  TRANS_STAR_WOMAN = 'TRANS_STAR_WOMAN',
  TWO_SPIRIT = 'TWO_SPIRIT',
  TWO_SPIRIT_PERSON = 'TWO_SPIRIT_PERSON',
  TWO_STAR_PERSON = 'TWO_STAR_PERSON',
  T_STAR_MAN = 'T_STAR_MAN',
  T_STAR_WOMAN = 'T_STAR_WOMAN',
  WOMAN = 'WOMAN',
}
registerEnumType(UserGenders, { name: 'UserGenders' });

/**
 * User roles.
 */
export enum UserRoles {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
}
registerEnumType(UserRoles, { name: 'UserRoles' });

/**
 * User entity.
 */
@Entity('user')
@ObjectType()
export default class User {
  /**
   * User's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => ID)
  id!: string;

  /**
   * User's username.
   */
  @Column({ length: 64, unique: true, update: false })
  @Field(() => GraphQLNonEmptyString)
  username!: string;

  /**
   * User's password.
   */
  @Column({
    length: 72,
    select: false,
    transformer: {
      to: (value) => (value ? CryptUtil.hashSync(value) : undefined),
      from: (value) => value,
    },
  })
  password?: string;

  /**
   * User's roles.
   */
  @Column({ type: 'enum', enum: UserRoles, array: true, default: [UserRoles.USER] })
  @Field(() => [UserRoles])
  roles!: UserRoles[];

  /**
   * User's name.
   */
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    default: undefined,
    transformer: {
      to: (value) => (value ? _.capitalize(value) : undefined),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string;

  /**
   * User's surname.
   */
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    default: undefined,
    transformer: {
      to: (value) => (value ? _.capitalize(value) : undefined),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  surname?: string;

  /**
   * User's gender.
   */
  @Column({ type: 'enum', enum: UserGenders })
  @Field(() => UserGenders)
  gender!: UserGenders;

  /**
   * User's date of birth.
   */
  @Column({ type: 'date', name: 'date_of_birth', nullable: true, default: undefined })
  @Field(() => GraphQLDate, { nullable: true })
  dateOfBirth?: Date;

  /**
   * User's email.
   */
  @Column({ length: 128, unique: true, update: false })
  @Field(() => GraphQLEmailAddress)
  email!: string;

  /**
   * User creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  /**
   * User last updated date and time.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime)
  updatedAt!: Date;
}
