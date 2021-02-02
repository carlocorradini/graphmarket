import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, ProductExternal } from '@graphmarket/entities';
import { InventoryService } from '@app/services';
import { GraphQLBoolean, GraphQLNonNegativeInt, GraphQLPrice } from '@graphmarket/graphql-scalars';
import { FindInventoryArgs } from '@app/args';

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
    @Args() args: FindInventoryArgs,
  ): Promise<Inventory[]> {
    return this.inventoryService.readByProduct(product.id, args);
  }

  /**
   * Resolves if the product is available.
   *
   * @param product - Product to obtain the availability of
   * @returns True if the product is available in the inventories
   */
  @FieldResolver(() => GraphQLBoolean, {
    description: `Boolean flag that checks if the product is available in at least one inventory. The quantity must be greater than 0`,
  })
  async available(@Root() product: ProductExternal): Promise<boolean> {
    return (await this.inventoryService.quantityByProduct(product.id)) > 0;
  }

  /**
   * Resolves the total quantity of the product in the inventories.
   *
   * @param product - Product to obtain the total quantity of
   * @returns Total quantity of the product available in the inventories
   */
  @FieldResolver(() => GraphQLNonNegativeInt, {
    description: `Total quantity of the product available from the inventories`,
  })
  quantity(@Root() product: ProductExternal): Promise<number> {
    return this.inventoryService.quantityByProduct(product.id);
  }

  /**
   * Resolves the best selling price of the product from the available inventories.
   *
   * @param product - Product to obtain the best price of
   * @returns Best price of the product available in the inventories
   */
  @FieldResolver(() => GraphQLPrice, {
    nullable: true,
    description: `Best selling price of the product from the available inventories.`,
  })
  price(@Root() product: ProductExternal): Promise<number | undefined> {
    return this.inventoryService.priceByProduct(product.id);
  }
}
