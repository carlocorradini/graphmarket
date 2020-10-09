import { Repository } from 'typeorm';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Product, User } from '@app/entities';
import { IContext } from '@app/types';
import { GraphQLPositiveInt } from '../scalars';
import { PaginationArgs } from '../args';
import { ProductCreateInput, ProductUpdateInput } from '../inputs';

@Resolver(Product)
@Service()
export default class ProductResolver {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => Product, { nullable: true })
  product(@Arg('id', () => GraphQLPositiveInt) id: number): Promise<Product | undefined> {
    return this.productRepository.findOne(id);
  }

  @Query(() => [Product])
  products(@Args() { skip, take }: PaginationArgs): Promise<Product[]> {
    return this.productRepository.find({ skip, take });
  }

  @Mutation(() => Product)
  @Authorized()
  createProduct(@Arg('data') data: ProductCreateInput, @Ctx() ctx: IContext): Promise<Product> {
    const product: Product = this.productRepository.create({
      ...data,
      owner: this.userRepository.create({ id: ctx.user!.id }),
    });
    return this.productRepository.save(product);
  }

  @Mutation(() => Product)
  @Authorized()
  async updateProduct(
    @Arg('data') data: ProductUpdateInput,
    @Ctx() ctx: IContext,
  ): Promise<Product> {
    const product: Product = this.productRepository.create({
      ...data,
      owner: this.userRepository.create({ id: ctx.user!.id }),
    });
    await this.productRepository.update(product.id, product);
    return this.productRepository.findOneOrFail(product.id);
  }

  // TODO cambia
  @Mutation(() => Product, { nullable: true })
  @Authorized()
  async deleteProduct(
    @Arg('id', () => GraphQLPositiveInt) id: number,
    @Ctx() ctx: IContext,
  ): Promise<Product | undefined> {
    const product: Product | undefined = await this.productRepository.findOne(id);
    if (!product) return undefined;
    if (product.owner_id !== ctx.user!.id) return undefined;
    await this.productRepository.delete(product.id);
    return product;
  }

  @FieldResolver()
  owner(@Root() product: Product): Promise<User> {
    return this.userRepository.findOneOrFail(product.owner_id);
  }
}
