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

export enum UserGenders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserRoles {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

registerEnumType(UserGenders, { name: 'UserGenders' });
registerEnumType(UserRoles, { name: 'UserRoles' });

@Entity('user')
@ObjectType()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => ID)
  id!: string;

  @Column({ length: 64, unique: true, update: false })
  @Field(() => GraphQLNonEmptyString)
  username!: string;

  @Column({
    length: 72,
    select: false,
    transformer: {
      to: (value) => (value ? CryptUtil.hashSync(value) : undefined),
      from: (value) => value,
    },
  })
  password?: string;

  @Column({ type: 'enum', enum: UserRoles, array: true, default: [UserRoles.USER] })
  @Field(() => [UserRoles])
  roles!: UserRoles[];

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

  @Column({ type: 'enum', enum: UserGenders })
  @Field(() => UserGenders)
  gender!: UserGenders;

  @Column({ type: 'date', nullable: true, default: undefined })
  @Field(() => GraphQLDate, { nullable: true })
  date_of_birth?: Date;

  @Column({ length: 128, unique: true, update: false })
  @Field(() => GraphQLEmailAddress)
  email!: string;

  @CreateDateColumn({ update: false })
  @Field(() => GraphQLDateTime)
  created_at!: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updated_at!: Date;

  @OneToMany(() => Product, (product) => product.owner, { nullable: false })
  @Field(() => [Product])
  products!: Product[];

  @RelationId((user: User) => user.products)
  products_ids!: number[];
}
