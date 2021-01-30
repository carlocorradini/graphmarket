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
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Inject, Service } from 'typedi';
import { User, UserRoles } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLNonEmptyString, GraphQLUUID } from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { UserService } from '@app/services';
import { UserCreateInput, UserUpdateInput } from '@app/inputs';

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
   * Resolves the user's full name.
   *
   * @param user - User to obtain the full name of
   * @returns User's full name
   */
  @FieldResolver(() => GraphQLNonEmptyString, { description: `User's full name` })
  // eslint-disable-next-line class-methods-use-this
  async fullName(@Root() user: User): Promise<string> {
    return `${user.name} ${user.surname}`;
  }

  /**
   * Create a new user from the given data.
   *
   * @param data - User's data
   * @returns Created user
   */
  @Mutation(() => User, { description: `Create a new user` })
  createUser(@Arg('data', () => UserCreateInput) data: UserCreateInput): Promise<User> {
    return this.userService.create(data as User);
  }

  /**
   * Resolves the current authenticated user.
   *
   * @param ctx - Request context
   * @returns Current authenticated user
   */
  @Query(() => User, { description: `Return the current authenticated user` })
  @Authorized()
  me(@Ctx() ctx: IGraphQLContext): Promise<User> {
    return this.userService.readOneOrFail(ctx.user!.id);
  }

  /**
   * Resolves the User that match the given id.
   *
   * @param id - User's id
   * @returns User that match the id
   */
  @Query(() => User, { nullable: true, description: `Return the user that matches the id` })
  user(@Arg('id', () => GraphQLUUID) id: string): Promise<User | undefined> {
    return this.userService.readOne(id);
  }

  /**
   * Resolves all available users.
   *
   * @param param0 - Pagination arguments
   * @returns All available users
   */
  @Query(() => [User], { description: `Return all users` })
  @Authorized(UserRoles.ADMINISTRATOR)
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
  @Mutation(() => User, { description: `Update current authenticated user` })
  @Authorized()
  updateMe(
    @Arg('data', () => UserUpdateInput) data: UserUpdateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<User> {
    return this.userService.update(ctx.user!.id, data, ctx.user!);
  }

  /**
   * Update avatar of the current authenticated user.
   *
   * @param file - Avatar image
   * @param ctx - Request context
   * @returns Updated user
   */
  @Mutation(() => User, { description: `Update avatar of the current authenticated user` })
  @Authorized()
  updateAvatar(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<User> {
    return this.userService.updateAvatar(ctx.user!.id, file.createReadStream());
  }

  /**
   * Delete the current authenticated user.
   *
   * @param ctx - Request context
   * @returns Deleted user
   */
  @Mutation(() => User, { description: `Delete the current authenticated user` })
  @Authorized()
  deleteMe(@Ctx() ctx: IGraphQLContext): Promise<User> {
    return this.userService.delete(ctx.user!.id, ctx.user!);
  }
}
