import { Directive, Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  GraphQLNonEmptyString,
  GraphQLID,
  GraphQLPositiveInt,
  GraphQLURL,
  GraphQLDateTime,
} from '@graphmarket/graphql-scalars';

/**
 * Product categories.
 */
export enum ProductCategories {
  AUTOMOTIVE_AND_POWERSPORTS = 'AUTOMOTIVE_AND_POWERSPORTS',
  BABY_PRODUCTS = 'BABY_PRODUCTS',
  BEAUTY = 'BEAUTY',
  BOOKS = 'BOOKS',
  CAMERA_AND_PHOTO = 'CAMERA_AND_PHOTO',
  CELL_PHONES_AND_ACCESSORIES = 'CELL_PHONES_AND_ACCESSORIES',
  COLLECTIBLE_COINS = 'COLLECTIBLE_COINS',
  CONSUMER_ELECTRONICS = 'CONSUMER_ELECTRONICS',
  ENTERTAINMENT_COLLECTIBLES = 'ENTERTAINMENT_COLLECTIBLES',
  FINE_ART = 'FINE_ART',
  GROCERY_AND_GOURMET_FOOD = 'GROCERY_AND_GOURMET_FOOD',
  HEALTH_AND_PERSONAL_CARE = 'HEALTH_AND_PERSONAL_CARE',
  HOME_AND_GARDEN = 'HOME_AND_GARDEN',
  INDEPENDENT_DESIGN = 'INDEPENDENT_DESIGN',
  INDUSTRIAL_AND_SCIENTIFIC = 'INDUSTRIAL_AND_SCIENTIFIC',
  MAJOR_APPLIANCES = 'MAJOR_APPLIANCES',
  MUSIC = 'MUSIC',
  MUSICAL_INSTRUMENTS = 'MUSICAL_INSTRUMENTS',
  OFFICE_PRODUCTS = 'OFFICE_PRODUCTS',
  OUTDOORS = 'OUTDOORS',
  PERSONAL_COMPUTERS = 'PERSONAL_COMPUTERS',
  PET_SUPPLIES = 'PET_SUPPLIES',
  SOFTWARE = 'SOFTWARE',
  SPORTS = 'SPORTS',
  SPORTS_COLLECTIBLES = 'SPORTS_COLLECTIBLES',
  TOOLS_AND_HOME_IMPROVEMENTS = 'TOOLS_AND_HOME_IMPROVEMENTS',
  TOYS_AND_GAMES = 'TOYS_AND_GAMES',
  VIDEO_AND_DVD_AND_BLU_RAY = 'VIDEO_AND_DVD_AND_BLU_RAY',
  VIDEO_GAMES = 'VIDEO_GAMES',
  WATCHES = 'WATCHES',
}
registerEnumType(ProductCategories, { name: 'ProductCategories' });

/**
 * Product conditions.
 */
export enum ProductConditions {
  NEW = 'NEW',
  RENEWED = 'RENEWED',
  USED_LIKE_NEW_OR_OPEN_BOX = 'USED_LIKE_NEW_OR_OPEN_BOX',
  USED_VERY_GOOD = 'USED_VERY_GOOD',
  USED_GOOD = 'USED_GOOD',
  USED_ACCEPTABLE = 'USED_ACCEPTABLE',
}
registerEnumType(ProductConditions, { name: 'ProductConditions' });

/**
 * Product entity.
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
    default:
      '{https://res.cloudinary.com/dxiqa0xwa/image/upload/v1609604389/graphmarket/product/photo/product.png}',
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
}
