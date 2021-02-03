import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, UserExternal } from '@graphmarket/entities';
import { InventoryService } from '@app/services';
import { FindInventoriesArgs } from '@app/args';

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
   * @param param1 - Pagination arguments
   * @returns Inventories of the seller
   */
  @FieldResolver(() => [Inventory], { description: `Seller's inventories` })
  inventories(
    @Root() seller: UserExternal,
    @Args() { skip, take, stock }: FindInventoriesArgs,
  ): Promise<Inventory[]> {
    return this.inventoryService.read({ skip, take, stock, sellerId: seller.id });
  }
}
