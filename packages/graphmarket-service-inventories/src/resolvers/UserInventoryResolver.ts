import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, UserExternal } from '@graphmarket/entities';
import { InventoryService } from '@app/services';

/**
 * User inventory resolver.
 *
 * @see InventoryService
 */
@Resolver(() => UserExternal)
@Service()
export default class UserInventoryResolver {
  /**
   * Inventory service.
   */
  @Inject()
  private readonly inventoryService!: InventoryService;

  /**
   * Resolves the inventories of a seller.
   *
   * @param seller - Seller to obtain the inventories of
   * @returns Inventories of the seller
   */
  @FieldResolver(() => [Inventory])
  inventories(@Root() seller: UserExternal): Promise<Inventory[]> {
    return this.inventoryService.readBySeller(seller.id);
  }
}
