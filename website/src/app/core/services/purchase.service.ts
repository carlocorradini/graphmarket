import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Purchase } from '../models';

export interface PurchaseCreateValues {
  inventoryId: string;
  quantity: number;
}

const MUTATION_CREATE_PURCHASE = gql`
  mutation CreatePurchase($inventoryId: UUID!, $quantity: PositiveInt!) {
    purchase: createPurchase(inventoryId: $inventoryId, data: { quantity: $quantity }) {
      id
      quantity
    }
  }
`;

@Injectable()
export class PurchaseService {
  public constructor(private readonly apollo: Apollo) {}

  public createPurchase(data: PurchaseCreateValues) {
    return this.apollo.mutate<{ purchase: Purchase }>({
      mutation: MUTATION_CREATE_PURCHASE,
      errorPolicy: 'all',
      variables: data,
    });
  }
}
