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

@Entity('recipe')
@ObjectType()
export default class Recipe {
  @PrimaryGeneratedColumn('increment')
  @Index()
  @Field(() => ID)
  id!: number;

  @Column({
    type: 'varchar',
    length: 64,
    transformer: {
      to: (value) => _.capitalize(value),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    transformer: {
      to: (value) => _.capitalize(value),
      from: (value) => value,
    },
  })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  @Field(() => User)
  author!: User;

  @RelationId((recipe: Recipe) => recipe.author)
  author_id!: string;

  @CreateDateColumn({ update: false })
  @Field(() => GraphQLDateTime)
  created_at!: Date;

  @UpdateDateColumn()
  @Field(() => GraphQLDateTime)
  updated_at!: Date;
}
