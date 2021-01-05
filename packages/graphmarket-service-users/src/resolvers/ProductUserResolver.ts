import { Inject, Service } from 'typedi';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import { User, ProductExternal } from '@graphmarket/entities';
import { UserService } from '@app/services';

/**
 * Product user resolver.
 *
 * @see UserService
 */
@Resolver(() => ProductExternal)
@Service()
export default class ProductUserResolver {
  /**
   * User service.
   */
  @Inject()
  private readonly userService!: UserService;

  /**
   * Resolves the seller of the product.
   *
   * @param product - Product to obtain the seller of
   * @returns Seller of the product
   */
  @FieldResolver(() => User)
  seller(@Root() product: ProductExternal): Promise<User> {
    return this.userService.readSeller(product.id);
  }
}
