import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, ProductExternal } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { InventoryService } from '@app/services';

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
   * @param param1 - Pagination arguments
   * @returns Inventories of the product
   */
  @FieldResolver(() => [Inventory])
  inventories(
    @Root() product: ProductExternal,
    @Args() { skip, take }: PaginationArgs,
  ): Promise<Inventory[]> {
    return this.inventoryService.readByProduct(product.id, { skip, take });
  }
}
