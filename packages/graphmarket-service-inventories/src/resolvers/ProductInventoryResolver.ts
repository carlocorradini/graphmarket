import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, ProductExternal } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { InventoryService } from '@app/services';
import { GraphQLPositiveInt } from '@graphmarket/graphql-scalars';

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
  @FieldResolver(() => [Inventory], { description: `Product's inventories` })
  inventories(
    @Root() product: ProductExternal,
    @Args() { skip, take }: PaginationArgs,
  ): Promise<Inventory[]> {
    return this.inventoryService.readByProduct(product.id, { skip, take });
  }

  /**
   * Resolves the best selling price of the product from the available inventories.
   *
   * @param product - Product to obtain the best price of
   * @returns Best price of the product available in the inventories
   */
  @FieldResolver(() => GraphQLPositiveInt, {
    nullable: true,
    description: `Best selling price of the product from the available inventories.`,
  })
  price(@Root() product: ProductExternal): Promise<number | undefined> {
    return this.inventoryService.priceByProduct(product.id);
  }
}
