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
import { Inventory } from '@app/inventory';
import { Purchase } from '@app/purchase';
import { Review } from '@app/review';
import UserGenders from './UserGenders';
import UserRoles from './UserRoles';

/**
 * User entity.
 */
@Entity('user')
@ObjectType('User', { description: `User` })
@Directive(`@key(fields: "id")`)
export default class User {
  /**
   * User's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID, { description: `User's id` })
  id!: string;

  /**
   * User's username.
   */
  @Column({ length: 64, unique: true, update: false })
  @Field(() => GraphQLNonEmptyString, { description: `User's username` })
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
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `User's name` })
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
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `User's surname` })
  surname?: string;

  /**
   * User's gender.
   */
  @Column({ type: 'enum', enum: UserGenders, nullable: true, default: undefined })
  @Field(() => UserGenders, { nullable: true, description: `User's gender` })
  gender?: UserGenders;

  /**
   * User's date of birth.
   */
  @Column({ type: 'date', name: 'date_of_birth', nullable: true, default: undefined })
  @Field(() => GraphQLDate, { nullable: true, description: `User's date of birth` })
  dateOfBirth?: Date;

  /**
   * User's email.
   */
  @Column({ length: 128, unique: true, update: false })
  @Field(() => GraphQLEmailAddress, { description: `User's email` })
  email!: string;

  /**
   * User's phone.
   */
  @Column({ length: 16, unique: true, update: false })
  @Field(() => GraphQLPhoneNumber, { description: `User's phone number` })
  phone!: string;

  /**
   * User's avatar.
   */
  @Column({
    length: 512,
    default: `https://res.cloudinary.com/dxiqa0xwa/image/upload/v1607739761/graphmarket/user/avatar/user.png`,
  })
  @Field(() => GraphQLURL, { description: `User's avatar url` })
  avatar!: string;

  /**
   * User creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime, { description: `User's creation date and time` })
  createdAt!: Date;

  /**
   * User last updated date and time.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime, { description: `User's last updated date and time` })
  updatedAt!: Date;

  /**
   * User is verified check.
   */
  @Column({ default: false, select: false })
  verified?: boolean;

  /**
   * User's purchases.
   */
  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases!: Purchase[];

  /**
   * User's purchases ids.
   */
  @RelationId((user: User) => user.purchases)
  purchasesIds!: string[];

  /**
   * User's reviews.
   */
  @OneToMany(() => Review, (review) => review.author)
  reviews!: Review[];

  /**
   * User's reviews ids.
   */
  @RelationId((user: User) => user.reviews)
  reviewsIds!: string[];

  /**
   * Seller's inventories.
   */
  @OneToMany(() => Inventory, (inventory) => inventory.seller)
  inventories!: Inventory[];

  /**
   * Seller's inventories ids.
   */
  @RelationId((seller: User) => seller.inventories)
  inventoriesIds!: string[];
}
