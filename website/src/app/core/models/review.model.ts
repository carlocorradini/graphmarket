import { Product } from "./product.model";
import { User } from "./user.model";

export interface Review {
  id: string;
  title?: string;
  body?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  product: Product;
  verified: boolean;
}