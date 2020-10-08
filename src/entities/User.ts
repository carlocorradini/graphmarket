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
import Recipe from './Recipe';

export enum UserGenders {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserRoles {
  USER = 'USER',
  USER_ADVANCED = 'USER_ADVANCED',
  USER_MODERATOR = 'USER_MODERATOR',
  USER_ADMIN = 'USER_ADMIN',
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
      to: (value) => {
        if (!value) return;
        // eslint-disable-next-line consistent-return
        return CryptUtil.hashSync(value);
      },
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
    transformer: {
      to: (value) => _.capitalize(value),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    transformer: {
      to: (value) => _.capitalize(value),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  surname?: string;

  @Column({ type: 'enum', enum: UserGenders })
  @Field(() => UserGenders)
  gender!: UserGenders;

  @Column({ type: 'date', nullable: true })
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

  @OneToMany(() => Recipe, (recipe) => recipe.author, { nullable: false })
  @Field(() => [Recipe])
  recipes!: Recipe[];

  @RelationId((user: User) => user.recipes)
  recipes_ids!: number[];
}
