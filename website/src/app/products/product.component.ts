import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
    }
  }
`;

@Component({
  selector: 'app-product-page',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  public product: any;

  public loading: boolean;

  public error: boolean;

  private queryProduct!: Subscription;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly apollo: Apollo,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.product = undefined;
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    const productId: string | null = this.route.snapshot.paramMap.get('productId');

    this.spinner.show();

    this.queryProduct = this.apollo
      .watchQuery<any>({
        query: GET_PRODUCT,
        errorPolicy: 'all',
        variables: {
          id: productId,
        },
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          this.spinner.hide();
          this.loading = loading;
          this.product = data.product;

          if (!this.product) this.showProductNotFound(productId);
          else {
          }
        },
        error: () => {
          this.spinner.hide();
          this.error = true;
        },
      });
  }

  public ngOnDestroy() {
    this.queryProduct.unsubscribe();
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
}
