import { Component, OnInit } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';

const GET_PRODUCTS = gql`
  query GetProducts($skip: NonNegativeInt, $take: PositiveInt) {
    products(skip: $skip, take: $take) {
      id
      cover
      name
      price
      rating
      available
      quantity
    }
  }
`;

@Component({
  selector: 'app-products-page',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  public static readonly DEFAULT_TAKE: number = 8;

  public products: any;

  public loading: boolean;

  public error: boolean;

  private queryProducts!: QueryRef<any>;

  public constructor(private readonly apollo: Apollo, private readonly spinner: NgxSpinnerService) {
    this.products = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    this.spinner.show();

    this.queryProducts = this.apollo.watchQuery<any>({
      query: GET_PRODUCTS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: ProductsComponent.DEFAULT_TAKE,
      },
    });

    this.products = this.queryProducts.valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.spinner.hide();
        this.loading = loading;
        this.products = data.products;
      },
      error: () => {
        this.error = true;
        this.spinner.hide();
      },
    });
  }

  public fetchMore() {
    this.spinner.show();

    this.queryProducts.fetchMore({
      variables: {
        skip: this.products.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.spinner.hide();

        if (!fetchMoreResult) {
          return prev;
        }

        return Object.assign({}, prev, {
          products: [...prev.products, ...fetchMoreResult.products],
        });
      },
    });
  }
}
