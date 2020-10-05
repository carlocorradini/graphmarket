import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import User from './User';

@Entity('recipe')
@ObjectType()
export default class Recipe {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  @Index()
  @Field(() => ID)
  id!: number;

  @Column({ name: 'name', type: 'varchar', length: 128 })
  @Field()
  name!: string;

  @Column({ name: 'description', type: 'varchar', length: 256, nullable: true, default: undefined })
  @Field({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinTable({ name: 'author_id' })
  @Field(() => User)
  author!: User;

  @RelationId((recipe: Recipe) => recipe.author)
  authorId!: string;
}
