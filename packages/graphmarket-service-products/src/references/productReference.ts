import { Container } from 'typedi';
import Product from '../entities/Product';
import ProductService from '../services/ProductService';

const productService: ProductService = Container.get(ProductService);

export default async function resolveProductReference(
  reference: Pick<Product, 'id'>,
): Promise<Product> {
  return productService.readOneOrFail(reference.id);
}
