import {
  Arg,
  Args,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject, Service } from 'typedi';
import { UserRoles, Product } from '@graphmarket/entities';
import { GraphQLURL, GraphQLUUID } from '@graphmarket/graphql-scalars';
import { ProductCreateInput, ProductUpdateInput } from '@app/inputs';
import { ProductService } from '@app/services';
import { FindProductsArgs } from '@app/args';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

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
   * Resolves the cover of the product.
   *
   * @param product - Product to obtain the cover of
   * @returns Cover of the product
   */
  @FieldResolver(() => GraphQLURL, {
    nullable: true,
    description: `Product's cover.It is the first image of the available photos`,
  })
  // eslint-disable-next-line class-methods-use-this
  async cover(@Root() product: Product): Promise<string | undefined> {
    return product.photos.length !== 0 ? product.photos[0] : undefined;
  }

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
  products(@Args() args: FindProductsArgs): Promise<Product[]> {
    return this.productService.read(args);
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
   * Update photo of the product identified by id.
   *
   * @param id - Product id
   * @param file - Photo file
   * @returns Updated product
   */
  @Mutation(() => Product, { description: `Update photo of the product.` })
  @Authorized(UserRoles.ADMINISTRATOR)
  async updateProductPhoto(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('file', () => GraphQLUpload) file: FileUpload,
  ): Promise<Product> {
    return this.productService.updatePhoto(id, await file.createReadStream());
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
