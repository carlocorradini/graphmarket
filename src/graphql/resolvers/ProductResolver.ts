import { Repository, TransactionRepository } from 'typeorm';
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
import { ProductRepository } from '@app/repositories';
import { GraphQLPositiveInt } from '../scalars';
import { PaginationArgs } from '../args';
import { ProductCreateInput, ProductUpdateInput } from '../inputs';

@Resolver(Product)
@Service()
export default class ProductResolver {
  constructor(
    @InjectRepository(Product)
    @TransactionRepository()
    private readonly productRepository: ProductRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => Product, { nullable: true })
  @Authorized()
  product(@Arg('id', () => GraphQLPositiveInt) id: number): Promise<Product | undefined> {
    return this.productRepository.readOneOrFail(id);
  }

  @Query(() => [Product])
  @Authorized()
  products(@Args() { skip, take }: PaginationArgs): Promise<Product[]> {
    return this.productRepository.readOrFail({ skip, take });
  }

  @Mutation(() => Product)
  @Authorized()
  createProduct(@Arg('data') data: ProductCreateInput, @Ctx() ctx: IContext): Promise<Product> {
    return this.productRepository.createOrFail(data, ctx.user!.id);
  }

  @Mutation(() => Product)
  @Authorized()
  updateProduct(
    @Arg('id', () => GraphQLPositiveInt) id: number,
    @Arg('data') data: ProductUpdateInput,
    @Ctx() ctx: IContext,
  ): Promise<Product> {
    return this.productRepository.updateOrFail(id, data, ctx.user!.id);
  }

  @Mutation(() => Product, { nullable: true })
  @Authorized()
  deleteProduct(
    @Arg('id', () => GraphQLPositiveInt) id: number,
    @Ctx() ctx: IContext,
  ): Promise<Product> {
    return this.productRepository.deleteOrFail(id, ctx.user!.id);
  }

  @FieldResolver()
  owner(@Root() product: Product): Promise<User> {
    return this.userRepository.findOneOrFail(product.ownerId);
  }
}
