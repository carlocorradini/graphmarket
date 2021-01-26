import { Directive, Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import {
  GraphQLNonEmptyString,
  GraphQLID,
  GraphQLURL,
  GraphQLDateTime,
} from '@graphmarket/graphql-scalars';
import { Inventory } from '@app/inventory';
import { Review } from '@app/review';
import { User } from '@app/user';
import ProductCategories from './ProductCategories';

/**
 * Product entity.
 */
@Entity('product')
@ObjectType('Product', { description: `Product` })
@Directive(`@key(fields: "id")`)
export default class Product {
  /**
   * Product's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID, { description: `Product's id` })
  id!: string;

  /**
   * Product's category.
   */
  @Column({ type: 'enum', enum: ProductCategories })
  @Field(() => ProductCategories, { description: `Product's category` })
  category!: ProductCategories;

  /**
   * Product's name.
   */
  @Column({ length: 128 })
  @Field(() => GraphQLNonEmptyString, { description: `Product's name` })
  name!: string;

  /**
   * Product's description.
   */
  @Column({ length: 256, nullable: true, default: undefined })
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Product's description` })
  description?: string;

  /**
   * Product's photos.
   */
  @Column({
    type: 'varchar',
    length: 512,
    array: true,
    default: '{}',
  })
  @Field(() => [GraphQLURL], { description: `Product's photos` })
  photos!: string[];

  /**
   * Product creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime, { description: `Product's creation date and time` })
  createdAt!: Date;

  /**
   * Product last updated date and time.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime, { description: `Product's last updated date and time` })
  updatedAt!: Date;

  /**
   * Product's inventories.
   */
  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories!: Inventory[];

  /**
   * Product's inventories ids.
   */
  @RelationId((product: Product) => product.inventories)
  inventoriesIds!: string[];

  /**
   * Product's reviews.
   */
  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];

  /**
   * Product's reviews ids.
   */
  @RelationId((user: User) => user.reviews)
  reviewsIds!: string[];
}
