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
import User from '@app/entities/User';
import Product from '@app/entities/Product';
import { IContext } from '@app/types';
import { UserRepository } from '@app/repositories';
import { GraphQLNonEmptyString, GraphQLUUID } from '../scalars';
import { PaginationArgs } from '../args';
import { UserCreateInput, UserUpdateInput } from '../inputs';

/**
 * User resolver.
 */
@Resolver(User)
@Service()
export default class UserResolver {
  /**
   * Construct a new user resolver.
   *
   * @param userRepository - User database repository
   * @param productRepository - Product database repository
   */
  constructor(
    @InjectRepository(UserRepository)
    @TransactionRepository()
    private readonly userRepository: UserRepository,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Resolves the current authenticated user.
   *
   * @param ctx - GraphQL context
   * @returns Current authenticated user
   */
  @Query(() => User)
  @Authorized()
  me(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.readOneOrFail(ctx.user!.id);
  }

  /**
   * Resolves the User that match with the given id.
   *
   * @param id - User's id
   * @returns User that match the given id, undefined otherwise
   */
  @Query(() => User, { nullable: true })
  @Authorized()
  user(@Arg('id', () => GraphQLUUID) id: string): Promise<User | undefined> {
    return this.userRepository.readOneOrFail(id);
  }

  /**
   * Resolves all available users.
   *
   * @param paginationArgs - Pagination arguments
   * @returns All available users
   */
  @Query(() => [User])
  @Authorized()
  users(@Args() { skip, take }: PaginationArgs): Promise<User[]> {
    return this.userRepository.readOrFail({ skip, take });
  }

  /**
   * Create a new user from the given data.
   *
   * @param data - User's data
   * @returns Newly created user
   */
  @Mutation(() => User)
  createUser(@Arg('data') data: UserCreateInput): Promise<User> {
    return this.userRepository.createOrFail(data);
  }

  /**
   * Update the current authenticated user.
   *
   * @param data - User's data
   * @param ctx - GraphQL context
   * @returns Updated user
   */
  @Mutation(() => User)
  @Authorized()
  updateMe(@Arg('data') data: UserUpdateInput, @Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.updateOrFail(ctx.user!.id, data, ctx.user!);
  }

  /**
   * Delete the current authenticated user.
   *
   * @param ctx - GraphQL context
   * @returns Deleted user
   */
  @Mutation(() => User)
  @Authorized()
  deleteMe(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.deleteOrFail(ctx.user!.id, ctx.user!);
  }

  /**
   * Resolves a sign in operation.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Encoded JWT authentication token
   */
  @Mutation(() => GraphQLNonEmptyString)
  signIn(
    @Arg('username', () => GraphQLNonEmptyString) username: string,
    @Arg('password', () => GraphQLNonEmptyString) password: string,
  ): Promise<string> {
    return this.userRepository.signIn(username, password);
  }

  /**
   * Resolves a sign out operation.
   *
   * @param ctx - GraphQL context
   * @returns True if signed out, false otherwise
   */
  @Mutation(() => Boolean)
  @Authorized()
  signOut(@Ctx() ctx: IContext): Promise<boolean> {
    return this.userRepository.signOut(ctx.user!);
  }

  /**
   * Resolves all user products.
   *
   * @param user - User root entity
   * @returns All user products
   */
  @FieldResolver()
  products(@Root() user: User): Promise<Product[]> {
    return this.productRepository.findByIds(user.productsIds);
  }
}
