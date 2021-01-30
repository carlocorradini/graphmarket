import { Product } from "./product.model";
import { User } from "./user.model";

export enum ProductConditions {
  NEW = 'NEW',
  RENEWED = 'RENEWED',
  USED_LIKE_NEW_OR_OPEN_BOX = 'USED_LIKE_NEW_OR_OPEN_BOX',
  USED_VERY_GOOD = 'USED_VERY_GOOD',
  USED_GOOD = 'USED_GOOD',
  USED_ACCEPTABLE = 'USED_ACCEPTABLE',
}

export interface Inventory {
  id: string;
  price: string;
  quantity: number;
  condition: ProductConditions;
  createdAt: Date;
  updatedAt: Date;
  seller: User;
  product: Product;
}