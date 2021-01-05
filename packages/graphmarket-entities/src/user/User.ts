import _ from 'lodash';
import { Directive, Field, ObjectType } from 'type-graphql';
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
  GraphQLPhoneNumber,
  GraphQLURL,
  GraphQLID,
} from '@graphmarket/graphql-scalars';
import { CryptUtil } from '@graphmarket/utils';
import { Product } from '@app/product';
import UserGenders from './UserGenders';
import UserRoles from './UserRoles';

/**
 * User entity.
 */
@Entity('user')
@ObjectType('User')
@Directive(`@key(fields: "id")`)
export default class User {
  /**
   * User's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID)
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
    length: 60,
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
  @Column({ type: 'enum', enum: UserGenders, nullable: true, default: undefined })
  @Field(() => UserGenders, { nullable: true })
  gender?: UserGenders;

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
   * User's phone.
   */
  @Column({ length: 16, unique: true, update: false })
  @Field(() => GraphQLPhoneNumber)
  phone!: string;

  /**
   * User's avatar.
   */
  @Column({
    length: 512,
    default: `https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png`,
  })
  @Field(() => GraphQLURL)
  avatar!: string;

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
   * User is verified check.
   */
  @Column({ default: false, select: false })
  verified?: boolean;

  /**
   * User's products for sale.
   */
  @OneToMany(() => Product, (product) => product.seller, { nullable: false })
  productsForSale!: Product[];

  /**
   * User's products for sale ids.
   */
  @RelationId((user: User) => user.productsForSale)
  productsForSaleIds!: string[];
}
