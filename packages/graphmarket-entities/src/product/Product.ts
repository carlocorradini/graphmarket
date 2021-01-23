import { Directive, Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import {
  GraphQLNonEmptyString,
  GraphQLID,
  GraphQLPositiveInt,
  GraphQLURL,
  GraphQLDateTime,
} from '@graphmarket/graphql-scalars';
import { User } from '@app/user';
import { Inventory } from '@app/inventory';
import ProductCategories from './ProductCategories';

/**
 * Product entity.
 */
@Entity('product')
@ObjectType('Product')
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
   * Product's category.
   */
  @Column({ type: 'enum', enum: ProductCategories })
  @Field(() => ProductCategories)
  category!: ProductCategories;

  /**
   * Product's name.
   */
  @Column({ length: 128 })
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  /**
   * Product's description.
   */
  @Column({ length: 256, nullable: true, default: undefined })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  description?: string;

  /**
   * Product's price in cents.
   */
  @Column({ type: 'bigint' })
  @Field(() => GraphQLPositiveInt)
  price!: number;

  /**
   * Product's photos.
   */
  @Column({
    type: 'varchar',
    length: 512,
    array: true,
    default: '{}',
  })
  @Field(() => [GraphQLURL])
  photos!: string[];

  /**
   * Product creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  /**
   * Product last updated date and time.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime)
  updatedAt!: Date;

  /**
   * Product's seller.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'seller_id' })
  seller!: User;

  /**
   * Product's seller id.
   */
  @RelationId((product: Product) => product.seller)
  sellerId!: string;

  /**
   * Product's inventories.
   */
  @OneToMany(() => Inventory, (inventory) => inventory.product, { nullable: false })
  inventories!: Inventory[];

  /**
   * Product's inventories ids.
   */
  @RelationId((product: Product) => product.inventories)
  inventoriesIds!: string[];
}
