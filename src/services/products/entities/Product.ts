import { Field } from 'type-graphql';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { GraphQLID, GraphQLNonEmptyString } from '@app/graphql/scalars';

export default class Product {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID)
  id!: string;

  @Column({ length: 128 })
  @Field(() => GraphQLNonEmptyString)
  name!: string;
}
