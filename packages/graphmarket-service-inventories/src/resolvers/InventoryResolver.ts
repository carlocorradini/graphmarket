import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Inventory, UserRoles } from '@graphmarket/entities';
import { PaginationArgs } from '@graphmarket/graphql-args';
import { GraphQLUUID } from '@graphmarket/graphql-scalars';
import { IGraphQLContext } from '@graphmarket/interfaces';
import { InventoryService } from '@app/services';
import { InventoryCreateInput, InventoryUpdateInput } from '@app/inputs';

/**
 * Inventory resolver.
 *
 * @see Inventory
 * @see IventoryService
 */
@Resolver(Inventory)
@Service()
export default class InventoryResolver {
  /**
   * Inventory service.
   */
  @Inject()
  private readonly inventoryService!: InventoryService;

  /**
   * Create a new inventory from the given data.
   *
   * @param data - Inventory's data
   * @returns Created inventory
   */
  @Mutation(() => Inventory)
  @Authorized(UserRoles.SELLER)
  createInventory(
    @Arg('productId', () => GraphQLUUID) productId: string,
    @Arg('data', () => InventoryCreateInput) data: InventoryCreateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Inventory> {
    return this.inventoryService.create(productId, ctx.user!.id, data as Inventory);
  }

  /**
   * Resolves the inventory that match the given id.
   *
   * @param id - Inventory's id
   * @returns Inventory that match the id
   */
  @Query(() => Inventory, { nullable: true })
  inventory(@Arg('id', () => GraphQLUUID) id: string): Promise<Inventory | undefined> {
    return this.inventoryService.readOne(id);
  }

  /**
   * Resolves all available inventories.
   *
   * @param param0 - Pagination arguments
   * @returns All available inventories
   */
  @Query(() => [Inventory])
  inventories(@Args() { skip, take }: PaginationArgs): Promise<Inventory[]> {
    return this.inventoryService.read({ skip, take });
  }

  /**
   * Update the inventory identified by id.
   * Only the seller of the inventory can update it.
   *
   * @param id - Inventory's id
   * @param data - Inventory's data
   * @param ctx - Request context
   * @returns Updated inventory
   */
  @Mutation(() => Inventory)
  @Authorized(UserRoles.SELLER)
  updateInventory(
    @Arg('id', () => GraphQLUUID) id: string,
    @Arg('data', () => InventoryUpdateInput) data: InventoryUpdateInput,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, ctx.user!.id, data);
  }

  /**
   * Delete the inventory identified by the id.
   * Only the seller of the inventory can delete id.
   *
   * @param id - Inventory's id
   * @param ctx - Request context
   * @returns Deleted inventory
   */
  @Mutation(() => Inventory)
  @Authorized(UserRoles.SELLER)
  deleteInventory(
    @Arg('id', () => GraphQLUUID) id: string,
    @Ctx() ctx: IGraphQLContext,
  ): Promise<Inventory> {
    return this.inventoryService.delete(id, ctx.user!.id);
  }
}
