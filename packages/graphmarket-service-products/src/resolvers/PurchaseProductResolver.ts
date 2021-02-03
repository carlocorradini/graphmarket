import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { PurchaseExternal, Product } from '@graphmarket/entities';
import { ProductService } from '@app/services';

/**
 * Purchase product resolver.
 *
 * @see ProductService
 */
@Resolver(() => PurchaseExternal)
@Service()
export default class PurchaseProductResolver {
  /**
   * Product service.
   */
  @Inject()
  private readonly productService!: ProductService;

  /**
   * Resolves the product of a purchase.
   *
   * @param purchase - Purchase to obtain the product of
   * @returns Product of the purchase
   */
  @FieldResolver(() => Product, { description: `Purchase's product` })
  product(@Root() purchase: PurchaseExternal): Promise<Product | undefined> {
    return this.productService.readOneByPurchaseId(purchase.id);
  }
}
