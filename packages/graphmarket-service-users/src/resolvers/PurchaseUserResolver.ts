import { Inject, Service } from 'typedi';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import { User, PurchaseExternal } from '@graphmarket/entities';
import { UserService } from '@app/services';

/**
 * Purchase user resolver.
 *
 * @see UserService
 */
@Resolver(() => PurchaseExternal)
@Service()
export default class PurchaseUserResolver {
  /**
   * User service.
   */
  @Inject()
  private readonly userService!: UserService;

  /**
   * Resolves the seller of the purchase.
   *
   * @param purchase - Purchase to obtain the seller of
   * @returns Seller of the purchase
   */
  @FieldResolver(() => User, { description: `Purchase's seller` })
  seller(@Root() purchase: PurchaseExternal): Promise<User> {
    return this.userService.readOnebyPurchase(purchase.id);
  }
}
