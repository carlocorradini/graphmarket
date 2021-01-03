import { Container } from 'typedi';
import { Product } from '@graphmarket/entities';
import { ProductService } from '@app/services';

/**
 * Product service instance.
 *
 * @see ProductService
 */
const productService: ProductService = Container.get(ProductService);

/**
 * Resolve product reference.
 *
 * @param reference - Product reference identifier
 * @returns Product that match the reference identifier, undefined otherwise
 */
const resolveProductReference = (reference: Pick<Product, 'id'>): Promise<Product | undefined> =>
  productService.readOne(reference.id);

export default resolveProductReference;
