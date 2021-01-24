import { Inject, Service } from 'typedi';
import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { UserExternal, Purchase } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { PurchaseService } from '@app/services';

/**
 * User purchase resolver.
 *
 * @see PurchaseService
 */
@Resolver(() => UserExternal)
@Service()
export default class PurchaseUserResolver {
  /**
   * Purchase service.
   */
  @Inject()
  private readonly purchaseService!: PurchaseService;

  /**
   * Resolves the puchases of the user.
   *
   * @param user - User to obtain the purchases of
   * @returns Purchases of the user
   */
  @FieldResolver(() => [Purchase])
  purchases(
    @Root() user: UserExternal,
    @Args() { skip, take }: PaginationArgs,
  ): Promise<Purchase[]> {
    return this.purchaseService.readByUser(user.id, { skip, take });
  }
}
