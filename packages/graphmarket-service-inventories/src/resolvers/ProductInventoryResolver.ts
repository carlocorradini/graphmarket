import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { InventoryService } from '@app/services';
import { Inventory, ProductExternal } from '@graphmarket/entities';

/**
 * Product inventory resolver.
 *
 * @see InventoryService
 */
@Resolver(() => ProductExternal)
@Service()
export default class ProductInventoryResolver {
  /**
   * Inventory service.
   */
  @Inject()
  private readonly inventoryService!: InventoryService;

  /**
   * Resolves the inventories available for the product.
   *
   * @param product - Product to obtain the inventories of
   * @returns Inventories of the product
   */
  @FieldResolver(() => [Inventory])
  inventories(@Root() product: ProductExternal): Promise<Inventory[]> {
    return this.inventoryService.readByProduct(product.id);
  }
}
