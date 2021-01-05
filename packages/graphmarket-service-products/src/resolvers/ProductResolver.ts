import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { UserRoles, Product } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { ProductCreateInput, ProductUpdateInput } from '@app/inputs';
import { ProductService } from '@app/services';

/**
 * Product resolver.
 *
 * @see Product
 * @see ProductService
 */
@Resolver(Product)
@Service()
export default class ProductResolver {
  /**
   * Product service.
   */
  @Inject()
  private readonly productService!: ProductService;

  /**
   * Create a new product from the given data.
   *
   * @param data - Product's data
   * @returns Created product
   */
  @Mutation(() => Product)
  @Authorized(UserRoles.SELLER)
  createProduct(
    @Arg('data', () => ProductCreateInput) data: ProductCreateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Product> {
    return this.productService.create(ctx.user!.id, data as Product);
  }

  /**
   * Resolves the Product that match the given id.
   *
   * @param id - Product's id
   * @returns Product that match the id
   */
  @Query(() => Product, { nullable: true })
  product(@Arg('id', () => GraphQLUUID) id: string): Promise<Product | undefined> {
    return this.productService.readOne(id);
  }

  /**
   * Resolves all available products.
   *
   * @param param0 - Pagination arguments
   * @returns All available products
   */
  @Query(() => [Product])
  products(@Args() { skip, take }: PaginationArgs): Promise<Product[]> {
    return this.productService.read({ skip, take });
  }

  /**
   * Update the product identified by the id.
   * Only the seller of the product can update it.
   *
   * @param id - Product's id
   * @param data - Product's data
   * @param ctx - Request context
   * @returns Updated product
   */
  @Mutation(() => Product)
  @Authorized(UserRoles.SELLER)
  updateProduct(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data', () => ProductUpdateInput) data: ProductUpdateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Product> {
    return this.productService.update(id, ctx.user!.id, data);
  }

  /**
   * Delete the product identified by the id.
   * Only the seller of the product can delete id.
   *
   * @param id - Product's id
   * @param ctx - Request context
   * @returns Deleted product
   */
  @Mutation(() => Product)
  @Authorized(UserRoles.SELLER)
  deleteProduct(
    @Arg('id', () => GraphQLUUID) id: string,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Product> {
    return this.productService.delete(id, ctx.user!.id);
  }
}
