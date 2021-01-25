import { Directive, Field, ObjectType } from 'type-graphql';
import {
  Check,
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
import {
  GraphQLDateTime,
  GraphQLID,
  GraphQLNonEmptyString,
  GraphQLPositiveInt,
} from '@graphmarket/graphql-scalars';
import { User } from '@app/user';
import { Product } from '@app/product';

/**
 * Review entity.
 */
@Entity('review')
@Check(`"rating" >= 1 AND "rating" <= 5`)
@ObjectType('Review')
@Directive(`@key(fields: "id")`)
export default class Review {
  /**
   * Review's id.
   */
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => GraphQLID)
  id!: string;

  /**
   * Review's title.
   */
  @Column({ length: 64, nullable: true, default: undefined })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  title?: string;

  /**
   * Review's body.
   */
  @Column({ length: 256, nullable: true, default: undefined })
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  body?: string;

  /**
   * Review's rating.
   */
  @Column({ type: 'smallint' })
  @Field(() => GraphQLPositiveInt)
  rating!: number;

  /**
   * Review creation date and time.
   */
  @CreateDateColumn({ name: 'created_at', update: false })
  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  /**
   * Review last updated date and time.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => GraphQLDateTime)
  updatedAt!: Date;

  /**
   * Review's author.
   */
  @ManyToOne(() => User, (author) => author.reviews, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  /**
   * Review's author id.
   */
  @RelationId((review: Review) => review.author)
  authorId!: string;

  /**
   * Reviews's product.
   */
  @ManyToOne(() => Product, (product) => product.reviews, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  /**
   * Review's product id.
   */
  @RelationId((review: Review) => review.product)
  productId!: string;
}
