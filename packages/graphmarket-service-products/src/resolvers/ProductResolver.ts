import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { PaginationArgs, GraphQLUUID } from '@graphmarket/commons';
import ProductService from '../services/ProductService';
import { ProductCreateInput } from '../inputs';
import Product from '../entities/Product';

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
  createProduct(@Arg('data', () => ProductCreateInput) data: ProductCreateInput): Promise<Product> {
    return this.productService.create(data as Product);
  }

  /**
   * Resolves the Product that match the given id.
   *
   * @param id - Product's id
   * @returns Product that match the id
   */
  @Query(() => Product, { nullable: true })
  @Authorized()
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
  @Authorized()
  products(@Args() { skip, take }: PaginationArgs): Promise<Product[]> {
    return this.productService.read({ skip, take });
  }
}
