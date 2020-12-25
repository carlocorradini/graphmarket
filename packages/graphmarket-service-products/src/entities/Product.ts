import { Directive, Field, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { GraphQLNonEmptyString, GraphQLID } from '@graphmarket/commons';

/**
 * User entity.
 */
@Entity('product')
@ObjectType()
@Directive(`@key(fields: "id")`)
export default class Product {
  /**
   * Product's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID)
  id!: string;

  /**
   * User's username.
   */
  @Column({ length: 128 })
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  /**
   * Product's description.
   */
  @Column({ length: 256 })
  @Field(() => GraphQLNonEmptyString)
  description!: string;
}
