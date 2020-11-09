import _ from 'lodash';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  RelationId,
} from 'typeorm';
import {
  GraphQLNonEmptyString,
  GraphQLDate,
  GraphQLDateTime,
  GraphQLEmailAddress,
} from '@app/graphql/scalars';
import { CryptUtil } from '@app/util';
// eslint-disable-next-line import/no-cycle
import Product from './Product';

/**
 * User genders.
 */
export enum UserGenders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(UserGenders, { name: 'UserGenders' });

/**
 * User roles.
 */
export enum UserRoles {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
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

  /**
   * User's products.
   */
  @OneToMany(() => Product, (product) => product.owner, { nullable: false })
  @Field(() => [Product])
  products!: Product[];

  /**
   * User's products ids.
   */
  @RelationId((user: User) => user.products)
  productsIds!: number[];
}
