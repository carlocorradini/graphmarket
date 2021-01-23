import { Directive, Field } from "type-graphql";
import { GraphQLID } from "@graphmarket/graphql-scalars";
import Inventory from "./Inventory";

/**
 * Inventory external entity.
 * 
 * @see Inventory
 */
export default class InventoryExternal implements Partial<Inventory> {
  /**
   * Inventory's id.
   */
  @Directive('@external')
  @Field(()=>GraphQLID)
  id!:string;
}