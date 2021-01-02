import { Container } from 'typedi';
import { Product } from '@graphmarket/entities';
import { ProductService } from '@app/services';

const productService: ProductService = Container.get(ProductService);

export default async function resolveProductReference(
  reference: Pick<Product, 'id'>,
): Promise<Product | undefined> {
  return productService.readOne(reference.id);
}
