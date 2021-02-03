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
export default function resolveInventoryReference(
  reference: Pick<Inventory, 'id'>,
): Promise<Inventory | undefined> {
  return inventoryService.readOneById(reference.id);
}
