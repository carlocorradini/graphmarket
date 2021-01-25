import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Service, Inject } from 'typedi';
import {
  GraphQLBoolean,
  GraphQLNonEmptyString,
  GraphQLUUID,
  GraphQLVoid,
} from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { AuthenticationService } from '@app/services';

/**
 * Authentication resolver.
 *
 * @see User
 * @see AuthenticationService
 */
@Resolver()
@Service()
export default class AuthenticationResolver {
  /**
   * Authentication service.
   */
  @Inject()
  private readonly authenticationService!: AuthenticationService;

  /**
   * Verify a user.
   *
   * @param id - User's id
   * @param emailCode - Email code
   * @param phoneCode - Phone code
   * @returns Verified user
   */
  @Mutation(() => GraphQLBoolean, { description: `Verify a user` })
  verify(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('emailCode', () => GraphQLNonEmptyString) emailCode: string,
    @Arg('phoneCode', () => GraphQLNonEmptyString) phoneCode: string,
  ): Promise<boolean> {
    return this.authenticationService.verify(id, emailCode, phoneCode);
  }

  /**
   * Resolves a sign in procedure.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Encoded authentication token
   */
  @Mutation(() => GraphQLNonEmptyString, { description: `Authenticate a user` })
  signIn(
    @Arg('username', () => GraphQLNonEmptyString) username: string,
    @Arg('password', () => GraphQLNonEmptyString) password: string,
  ): Promise<string> {
    return this.authenticationService.signIn(username, password);
  }

  /**
   * Resolves a sign out procedure.
   *
   * @param ctx - Request context
   */
  @Mutation(() => GraphQLVoid, { nullable: true, description: `Disconnect a user` })
  @Authorized()
  signOut(@Ctx() ctx: IGraphQLContext): Promise<void> {
    return this.authenticationService.signOut(ctx.user!);
  }
}
