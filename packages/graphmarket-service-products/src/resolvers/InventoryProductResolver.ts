import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { InventoryExternal, Product } from '@graphmarket/entities';
import { ProductService } from '@app/services';

/**
 * Inventory product resolver.
 *
 * @see ProductService
 */
@Resolver(() => InventoryExternal)
@Service()
export default class InventoryProductResolver {
  /**
   * Product service.
   */
  @Inject()
  private readonly productService!: ProductService;

  /**
   * Resolves the product of an inventory.
   *
   * @param inventory - Inventory to obtain the product of
   * @returns Product of the inventory
   */
  @FieldResolver(() => Product, { description: `Inventory's product` })
  product(@Root() inventory: InventoryExternal): Promise<Product> {
    return this.productService.readOneByInventory(inventory.id);
  }
}
