import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Inventory, ProductConditions } from '../../../core';
import Swal from 'sweetalert2';
declare var UIkit: any;

const QUERY_INVENTORIES = gql`
  query Inventories($skip: NonNegativeInt, $take: PositiveInt) {
    me {
      inventories(skip: $skip, take: $take) {
        id
        quantity
        price
        condition
        createdAt
        updatedAt
        product {
          cover
          name
        }
      }
    }
  }
`;

const QUERY_INVENTORY = gql`
  query Inventory($id: UUID!) {
    inventory(id: $id) {
      id
      price
      quantity
    }
  }
`;

const MUTATION_ADD_INVENTORY = gql`
  mutation AddInventory(
    $productId: UUID!
    $price: PositiveInt!
    $quantity: NonNegativeInt!
    $condition: ProductConditions!
  ) {
    inventory: createInventory(
      productId: $productId
      data: { price: $price, quantity: $quantity, condition: $condition }
    ) {
      id
    }
  }
`;

const MUTATION_UPDATE_INVENTORY = gql`
  mutation UpdateInventory($inventoryId: UUID!, $price: PositiveInt, $quantity: NonNegativeInt) {
    inventory: updateInventory(id: $inventoryId, data: { price: $price, quantity: $quantity }) {
      id
    }
  }
`;

@Component({ templateUrl: './inventories.component.html' })
export class InventoriesComponent implements OnInit {
  public static readonly DEFAULT_TAKE: number = 8;

  public inventories: Inventory[];

  public loading: boolean;

  public error: boolean;

  private queryInventories!: QueryRef<{ me: { inventories: Inventory[] } }>;

  public createInventoryForm = new FormGroup({
    productId: new FormControl(),
    price: new FormControl(),
    quantity: new FormControl(),
    condition: new FormControl(),
  });

  public updateInventoryForm = new FormGroup({
    inventoryId: new FormControl(),
    price: new FormControl(),
    quantity: new FormControl(),
  });

  public readonly productConditions = Object.entries(ProductConditions)
    .sort((a, b) => {
      return a[1].localeCompare(b[1]);
    })
    .map((inventory) => [inventory[0], inventory[1].replace(/_/g, ' ')]);

  public constructor(private readonly apollo: Apollo, private readonly spinner: NgxSpinnerService) {
    this.inventories = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    this.spinner.show();

    this.queryInventories = this.apollo.watchQuery<{ me: { inventories: Inventory[] } }>({
      query: QUERY_INVENTORIES,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: InventoriesComponent.DEFAULT_TAKE,
      },
    });

    this.inventories = (this.queryInventories.valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.spinner.hide();
        this.loading = loading;
        this.inventories = data.me.inventories;
      },
      error: () => {
        this.error = true;
        this.spinner.hide();
      },
    }) as unknown) as Inventory[];
  }

  public fetchMore() {
    this.spinner.show();

    this.queryInventories.fetchMore({
      variables: {
        skip: this.inventories.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.spinner.hide();

        if (!fetchMoreResult) {
          return prev;
        }

        return Object.assign({}, prev, {
          me: {
            inventories: [...prev.me.inventories, ...fetchMoreResult.me.inventories],
          },
        });
      },
    });
  }

  public onCreateInventorySubmit() {
    this.spinner.show();

    const inputs = Object.keys(this.createInventoryForm.value)
      .filter((k) => this.createInventoryForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.createInventoryForm.value[k] }), {});

    this.apollo
      .mutate<{ inventory: { id: string } }>({
        mutation: MUTATION_ADD_INVENTORY,
        errorPolicy: 'all',
        variables: inputs,
      })
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            html: `Inventory<br/>
            ${data.inventory.id}<br/>
            created successfully`,
          });
        }
      });
  }

  public editInventory(inventoryId: string) {
    this.spinner.show();

    this.apollo
      .query<{ inventory: Inventory }>({
        query: QUERY_INVENTORY,
        errorPolicy: 'all',
        variables: { id: inventoryId },
      })
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          this.updateInventoryForm.get('inventoryId')?.setValue(data.inventory.id);
          this.updateInventoryForm
            .get('price')
            ?.setValue(Math.trunc(Number.parseFloat(data.inventory.price) * 100));
          this.updateInventoryForm.get('quantity')?.setValue(data.inventory.quantity);
          UIkit.tab(document.getElementById('inventories-tab')).show(2);
        }
      });
  }

  public onUpdateInventorySubmit() {
    this.spinner.show();

    const inputs = Object.keys(this.updateInventoryForm.value)
      .filter((k) => this.updateInventoryForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.updateInventoryForm.value[k] }), {});

    this.apollo
      .mutate<{ inventory: { id: string } }>({
        mutation: MUTATION_UPDATE_INVENTORY,
        errorPolicy: 'all',
        variables: inputs,
      })
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(({ data, errors }) => {
        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            html: `Inventory<br/>
            ${data.inventory.id}<br/>
            updated successfully`,
          });
        }
      });
  }
}
