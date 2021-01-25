import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { UserRoles, Product } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';
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
  @Mutation(() => Product, { description: `Create a new product` })
  @Authorized(UserRoles.ADMINISTRATOR)
  createProduct(@Arg('data', () => ProductCreateInput) data: ProductCreateInput): Promise<Product> {
    return this.productService.create(data as Product);
  }

  /**
   * Resolves the Product that match the given id.
   *
   * @param id - Product's id
   * @returns Product that match the id
   */
  @Query(() => Product, { nullable: true, description: `Return the product that matches the id` })
  product(@Arg('id', () => GraphQLUUID) id: string): Promise<Product | undefined> {
    return this.productService.readOne(id);
  }

  /**
   * Resolves all available products.
   *
   * @param param0 - Pagination arguments
   * @returns All available products
   */
  @Query(() => [Product], { description: `Return all products` })
  products(@Args() { skip, take }: PaginationArgs): Promise<Product[]> {
    return this.productService.read({ skip, take });
  }

  /**
   * Update the product identified by the id.
   *
   * @param id - Product's id
   * @param data - Product's data
   * @returns Updated product
   */
  @Mutation(() => Product, { description: `Update the product` })
  @Authorized(UserRoles.ADMINISTRATOR)
  updateProduct(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data', () => ProductUpdateInput) data: ProductUpdateInput,
  ): Promise<Product> {
    return this.productService.update(id, data);
  }

  /**
   * Delete the product identified by the id.
   *
   * @param id - Product's id
   * @param ctx - Request context
   * @returns Deleted product
   */
  @Mutation(() => Product, { description: `Delete the product` })
  @Authorized(UserRoles.ADMINISTRATOR)
  deleteProduct(@Arg('id', () => GraphQLUUID) id: string): Promise<Product> {
    return this.productService.delete(id);
  }
}
