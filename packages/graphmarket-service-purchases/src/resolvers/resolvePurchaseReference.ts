import { Container } from 'typedi';
import { Purchase } from '@graphmarket/entities';
import { PurchaseService } from '@app/services';

/**
 * Purchase service instance.
 *
 * @see PurchaseService
 */
const purchaseService: PurchaseService = Container.get(PurchaseService);

/**
 * Resolve purchase reference.
 *
 * @param reference - Purchase reference identifier
 * @returns Purchase that match the reference identifier, undefined otherwise
 */
const resolvePurchaseReference = (reference: Pick<Purchase, 'id'>): Promise<Purchase | undefined> =>
  purchaseService.readOne(reference.id);

export default resolvePurchaseReference;
