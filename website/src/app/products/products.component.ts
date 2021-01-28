import { Component, OnInit } from '@angular/core';
import { ApolloError } from '@apollo/client/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';

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

/**
 * Products component.
 */
@Component({
  selector: 'app-products-page',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  public static readonly DEFAULT_TAKE: number = 8;

  public loading: boolean;

  public products: any;

  private queryProducts!: QueryRef<any>;

  public constructor(private readonly apollo: Apollo) {
    this.loading = true;
    this.products = [];
  }

  public ngOnInit(): void {
    this.queryProducts = this.apollo.watchQuery<any>({
      query: GET_PRODUCTS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: ProductsComponent.DEFAULT_TAKE,
      },
    });

    this.products = this.queryProducts.valueChanges.subscribe(({ loading, error, data }) => {
      this.loading = loading;
      this.products = data.products;
    });
  }

  public fetchMore() {
    this.queryProducts.fetchMore({
      variables: {
        skip: this.products.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
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
