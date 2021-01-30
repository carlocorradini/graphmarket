import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Inventory, Product, PurchaseService, UserService } from '../core';

const GET_PRODUCT = gql`
  query GetProduct($id: UUID!) {
    product(id: $id) {
      id
      category
      name
      description
      photos
      available
      quantity
      price
      rating
      reviews {
        title
        body
        rating
        verified
        createdAt
        author {
          id
          username
          avatar
        }
      }
      inventories(stock: IN_STOCK) {
        id
        price
        quantity
        condition
      }
    }
  }
`;

@Component({
  selector: 'app-product-page',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  public product: Product | undefined;

  public inventory: Inventory | undefined;

  public loading: boolean;

  public error: boolean;

  public isAuth: boolean;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly apollo: Apollo,
    private readonly userService: UserService,
    private readonly purchaseService: PurchaseService,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.product = undefined;
    this.loading = true;
    this.error = false;
    this.isAuth = false;
  }

  public ngOnInit(): void {
    const productId: string | null = this.route.snapshot.paramMap.get('productId');

    this.spinner.show();

    this.userService.isAuth.subscribe((isAuth) => {
      this.isAuth = isAuth;
    });

    this.apollo
      .query<{ product: Product }>({
        query: GET_PRODUCT,
        errorPolicy: 'all',
        variables: {
          id: productId,
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          this.spinner.hide();
          this.loading = loading;
          this.product = data.product;
          if (this.product.inventories.length > 0) this.inventory = this.product.inventories[0];

          if (!this.product) this.showProductNotFound(productId);
        },
        error: () => {
          this.spinner.hide();
          this.error = true;
        },
      });
  }

  private showProductNotFound(productId: string | null): void {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      html: `Product <br/>
      <span class="uk-text-bold">${productId}</span><br/>
      not found`,
    });
  }

  public changeInventory(inventoryId: string) {
    if (!this.product) return;
    this.inventory = this.product.inventories.find((inventory) => inventory.id === inventoryId);
  }

  public buy() {
    Swal.fire({
      title: 'Select the desired quantity',
      confirmButtonText: `<span uk-icon="check"></span> BUY`,
      showCancelButton: true,
      input: 'number',
      inputValue: 1,
      inputAttributes: {
        required: '',
        min: '1',
        ...{ max: this.inventory!.quantity.toString() },
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.purchaseService
        .createPurchase({
          inventoryId: this.inventory!.id,
          quantity: result.value,
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
              title: 'Congratulations!',
              html: `You have successfully bought ${data.purchase.quantity} <br/> <span class="uk-text-italic">${this.product?.name}</span>`,
              willClose: () => {
                window.location.reload();
              },
            });
          }
        });
    });
  }
}
