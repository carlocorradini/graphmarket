import { Container } from 'typedi';
import { Inventory } from '@graphmarket/entities';
import { InventoryService } from '@app/services';

/**
 * Inventory service instance.
 *
 * @see InventoryService
 */
const inventoryService: InventoryService = Container.get(InventoryService);

/**
 * Resolve inventory reference.
 *
 * @param reference - Inventory reference identifier
 * @returns Inventory that match the reference identifier, undefined otherwise
 */
const resolveInventoryReference = (reference: Pick<Inventory, 'id'>): Promise<Inventory | undefined> =>
  inventoryService.readOne(reference.id);

export default resolveInventoryReference;
