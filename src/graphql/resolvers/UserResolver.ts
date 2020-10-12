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
import User, { UserRoles } from '@app/entities/User';
import Product from '@app/entities/Product';
import { IContext } from '@app/types';
import { UserRepository } from '@app/repositories';
import { JWTHelper } from '@app/helper';
import { GraphQLNonEmptyString, GraphQLUUID, GraphQLVoid } from '../scalars';
import { PaginationArgs } from '../args';
import { UserCreateInput, UserUpdateInput } from '../inputs';

@Resolver(User)
@Service()
export default class UserResolver {
  constructor(
    @InjectRepository(UserRepository)
    @TransactionRepository()
    private readonly userRepository: UserRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @Query(() => User)
  @Authorized()
  me(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.findOneOrFail(ctx.user!.id);
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  user(@Arg('id', () => GraphQLUUID) id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  @Query(() => [User])
  @Authorized()
  users(@Args() { skip, take }: PaginationArgs): Promise<User[]> {
    return this.userRepository.find({ skip, take });
  }

  @Mutation(() => User)
  createUser(@Arg('data') data: UserCreateInput): Promise<User> {
    return this.userRepository.createOrFail(data);
  }

  @Mutation(() => User)
  @Authorized()
  updateMe(@Arg('data') data: UserUpdateInput, @Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.updateOrFail(ctx.user!.id, data);
  }

  @Mutation(() => User)
  @Authorized(UserRoles.ADMIN)
  updateUser(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data') data: UserUpdateInput,
  ): Promise<User> {
    return this.userRepository.updateOrFail(id, data);
  }

  @Mutation(() => User)
  @Authorized()
  deleteMe(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.deleteOrFail(ctx.user!.id);
  }

  @Mutation(() => User)
  @Authorized(UserRoles.ADMIN)
  deleteUser(@Arg('id', () => GraphQLUUID) id: string): Promise<User> {
    return this.userRepository.deleteOrFail(id);
  }

  @Mutation(() => GraphQLNonEmptyString)
  signIn(
    @Arg('username', () => GraphQLNonEmptyString) username: string,
    @Arg('password', () => GraphQLNonEmptyString) password: string,
  ): Promise<string> {
    return this.userRepository.signIn(username, password);
  }

  @Mutation(() => GraphQLVoid)
  @Authorized()
  // eslint-disable-next-line class-methods-use-this
  async signOut(@Ctx() ctx: IContext): Promise<void> {
    await JWTHelper.block(JWTHelper.getToken(ctx.req)!);
  }

  @FieldResolver()
  products(@Root() user: User): Promise<Product[]> {
    return this.productRepository.findByIds(user.productsIds);
  }
}
