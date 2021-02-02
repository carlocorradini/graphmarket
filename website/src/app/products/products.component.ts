import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from '../core';

const QUERY_PRODUCTS = gql`
  query Products($skip: NonNegativeInt, $take: PositiveInt, $name: NonEmptyString) {
    products(skip: $skip, take: $take, name: $name) {
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

  public products: Product[];

  public loading: boolean;

  public error: boolean;

  private queryProducts!: QueryRef<{ products: Product[] }>;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly apollo: Apollo,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.products = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(() => {
      this.initializeState();
    });
  }

  private initializeState(): void {
    this.spinner.show();

    const name: string | null = this.route.snapshot.queryParamMap.get('name');

    this.queryProducts = this.apollo.watchQuery<{ products: Product[] }>({
      query: QUERY_PRODUCTS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: ProductsComponent.DEFAULT_TAKE,
        ...(name && { name }),
      },
    });
    this.products = [];
    this.products = (this.queryProducts.valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.spinner.hide();
        this.loading = loading;
        this.products = data.products;
      },
      error: () => {
        this.error = true;
        this.spinner.hide();
      },
    }) as unknown) as Product[];
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
