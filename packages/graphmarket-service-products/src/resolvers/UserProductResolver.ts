import { Args, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Product, UserExternal } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { ProductService } from '@app/services';

/**
 * User product resolver.
 *
 * @see ProductService
 */
@Resolver(() => UserExternal)
@Service()
export default class UserProductResolver {
  /**
   * Product service.
   */
  @Inject()
  private readonly productService!: ProductService;

  /**
   * Resolves all available products for sale of a seller.
   *
   * @param param0 - Pagination arguments
   * @param seller - Seller to retrieve data of
   * @returns Products for sale of the seller found
   */
  @FieldResolver(() => [Product])
  productsForSale(
    @Args() { skip, take }: PaginationArgs,
    @Root() seller: UserExternal,
  ): Promise<Product[]> {
    return this.productService.readforSale(seller.id, { skip, take });
  }
}
