import { Directive, Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { GraphQLDateTime, GraphQLID, GraphQLPositiveInt } from '@graphmarket/graphql-scalars';
import { User } from '@app/user';
import { Inventory } from '@app/inventory';

/**
 * Purchase entity.
 */
@Entity('purchase')
@ObjectType('Purchase', { description: `Purchase` })
@Directive(`@key(fields: "id")`)
export default class Purchase {
  /**
   * Purchase's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID, { description: `Purchase's id` })
  id!: string;

  /**
   * Purchase's product price in cents.
   */
  @Column({ type: 'integer' })
  @Field(() => GraphQLPositiveInt, { description: `Purchase's product price in cents` })
  price!: number;

  /**
   * Purchase's product quantity.
   */
  @Column({ type: 'integer' })
  @Field(() => GraphQLPositiveInt, { description: `Purchase's product quantity` })
  quantity!: number;

  /**
   * Purchase creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime, { description: `Purchase's creation date and time` })
  createdAt!: Date;

  /**
   * Purchase's user.
   */
  @ManyToOne(() => User, (user) => user.purchases, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * Purchases's user id.
   */
  @RelationId((purchase: Purchase) => purchase.user)
  userId!: User;

  /**
   * Purchase's inventory.
   */
  @ManyToOne(() => Inventory, (inventory) => inventory.purchases, { nullable: false })
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory;

  /**
   * Purchase's inventory id.
   */
  @RelationId((purchase: Purchase) => purchase.inventory)
  inventoryId!: string;
}
