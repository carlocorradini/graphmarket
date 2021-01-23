import { Inject, Service } from 'typedi';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import { User, InventoryExternal } from '@graphmarket/entities';
import { UserService } from '@app/services';

/**
 * Inventory user resolver.
 *
 * @see UserService
 */
@Resolver(() => InventoryExternal)
@Service()
export default class InventoryUserResolver {
  /**
   * User service.
   */
  @Inject()
  private readonly userService!: UserService;

  /**
   * Resolves the seller of the inventory.
   *
   * @param inventory - Inventory to obtain the seller of
   * @returns Seller of the inventory
   */
  @FieldResolver(() => User)
  seller(@Root() inventory: InventoryExternal): Promise<User> {
    return this.userService.readOnebyInventory(inventory.id);
  }
}
