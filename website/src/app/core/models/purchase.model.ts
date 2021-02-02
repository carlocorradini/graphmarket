import { Product } from './product.model';
import { User } from './user.model';

export interface Purchase {
  id: string;
  price: number;
  quantity: number;
  createdAt: Date;
  amount: number;
  seller: User;
  product: Product;
}
