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
import { Inject, Service } from 'typedi';
import { Purchase } from '@graphmarket/entities';
import { GraphQLPositiveInt, GraphQLUUID } from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { PurchaseCreateInput } from '@app/inputs';
import { PurchaseService } from '@app/services';

/**
 * Purchase resolver.
 *
 * @see Purchase
 * @see PurchaseService
 */
@Resolver(Purchase)
@Service()
export default class PurchaseResolver {
  /**
   * Purchase service.
   */
  @Inject()
  private readonly purchaseService!: PurchaseService;

  /**
   * Resolves purchase's total amount.
   *
   * @param purchase - Purchase
   * @returns Total price
   */
  @FieldResolver(() => GraphQLPositiveInt, { description: `Purchase's total amount` })
  @Authorized()
  // eslint-disable-next-line class-methods-use-this
  async amount(@Root() purchase: Purchase): Promise<number> {
    return purchase.quantity * purchase.price;
  }

  /**
   * Create a new purchase from the given data.
   *
   * @param inventoryId - Inventory id
   * @param data - Purchase's data
   * @param ctx - Request context
   * @returns Created purchase
   */
  @Mutation(() => Purchase, { description: `Create a new purchase` })
  @Authorized()
  createPurchase(
    @Arg('inventoryId', () => GraphQLUUID) inventoryId: string,
    @Arg('data', () => PurchaseCreateInput) data: PurchaseCreateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Purchase> {
    return this.purchaseService.create(ctx.user!.id, inventoryId, data as Purchase);
  }

  /**
   * Resolves the purchases of the current authenticated user.
   *
   * @param ctx - Request context
   * @returns Purchases of the current authenticated user
   */
  @Query(() => [Purchase], {
    description: `Return all purchases of the current authenticated user`,
  })
  @Authorized()
  mePurchases(
    @Args() { skip, take }: PaginationArgs,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Purchase[]> {
    return this.purchaseService.readByUser(ctx.user!.id, { skip, take });
  }
}
