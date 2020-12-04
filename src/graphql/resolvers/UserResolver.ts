import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import User from '@app/entities/User';
import { IContext } from '@app/types';
import UserService from '@app/services/UserService';
import { GraphQLNonEmptyString, GraphQLUUID, GraphQLVoid } from '../scalars';
import { PaginationArgs } from '../args';
import { UserCreateInput, UserUpdateInput } from '../inputs';

/**
 * User resolver.
 *
 * @see User
 * @see UserService
 */
@Resolver(User)
@Service()
export default class UserResolver {
  /**
   * User service.
   */
  @Inject()
  private readonly userService!: UserService;

  /**
   * Create a new user from the given data.
   *
   * @param data - User's data
   * @returns Created user
   */
  @Mutation(() => User)
  createUser(@Arg('data') data: UserCreateInput): Promise<User> {
    return this.userService.create(data);
  }

  /**
   * Resolves the current authenticated user.
   *
   * @param ctx - Request context
   * @returns Current authenticated user
   */
  @Query(() => User)
  @Authorized()
  me(@Ctx() ctx: IContext): Promise<User> {
    return this.userService.readOneOrFail(ctx.user!.id);
  }

  /**
   * Resolves the User that match the given id.
   *
   * @param id - User's id
   * @returns User that match the id
   */
  @Query(() => User, { nullable: true })
  @Authorized()
  user(@Arg('id', () => GraphQLUUID) id: string): Promise<User | undefined> {
    return this.userService.readOne(id);
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
    return this.userService.read({ skip, take });
  }

  /**
   * Update the current authenticated user.
   *
   * @param data - User's data
   * @param ctx - Request context
   * @returns Updated user
   */
  @Mutation(() => User)
  @Authorized()
  updateMe(@Arg('data') data: UserUpdateInput, @Ctx() ctx: IContext): Promise<User> {
    return this.userService.update(ctx.user!.id, data);
  }

  /**
   * Delete the current authenticated user.
   *
   * @param ctx - Request context
   * @returns Deleted user
   */
  @Mutation(() => User)
  @Authorized()
  deleteMe(@Ctx() ctx: IContext): Promise<User> {
    return this.userService.delete(ctx.user!.id);
  }

  /**
   * Resolves a sign in procedure.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Encoded authentication token
   */
  @Mutation(() => GraphQLNonEmptyString)
  signIn(
    @Arg('username', () => GraphQLNonEmptyString) username: string,
    @Arg('password', () => GraphQLNonEmptyString) password: string,
  ): Promise<string> {
    return this.userService.signIn(username, password);
  }

  /**
   * Resolves a sign out procedure.
   *
   * @param ctx - Request context
   */
  @Mutation(() => GraphQLVoid, { nullable: true })
  @Authorized()
  signOut(@Ctx() ctx: IContext): Promise<void> {
    return this.userService.signOut(ctx.user!.id);
  }
}
