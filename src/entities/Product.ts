import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { GraphQLDateTime, GraphQLNonEmptyString } from '@app/graphql/scalars';
// eslint-disable-next-line import/no-cycle
import User from './User';

@Entity('product')
@ObjectType()
export default class Product {
  @PrimaryGeneratedColumn('increment')
  @Index()
  @Field(() => ID)
  id!: number;

  @Column({
    type: 'varchar',
    length: 64,
    transformer: {
      to: (value) => (value ? _.capitalize(value) : undefined),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    default: undefined,
    transformer: {
      to: (value) => (value ? _.capitalize(value) : undefined),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User)
  owner!: User;

  @RelationId((product: Product) => product.owner)
  owner_id!: string;

  @CreateDateColumn({ update: false })
  @Field(() => GraphQLDateTime)
  created_at!: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updated_at!: Date;
}
