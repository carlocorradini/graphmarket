import { Component } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Purchase } from 'src/app/core';

const QUERY_PURCHASES = gql`
  query Purchases($skip: NonNegativeInt, $take: PositiveInt) {
    purchases: mePurchases(skip: $skip, take: $take) {
      id
      quantity
      amount
      createdAt
      product {
        id
        cover
        name
      }
    }
  }
`;

@Component({
  selector: 'app-purchases-page',
  templateUrl: './purchases.component.html',
})
export class PurchasesComponent {
  public static readonly DEFAULT_TAKE: number = 2;

  public purchases: Purchase[];

  public loading: boolean;

  public error: boolean;

  private queryPurchases!: QueryRef<{ purchases: Purchase[] }>;

  public constructor(private readonly apollo: Apollo, private readonly spinner: NgxSpinnerService) {
    this.purchases = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    this.spinner.show();

    this.queryPurchases = this.apollo.watchQuery<{ purchases: Purchase[] }>({
      query: QUERY_PURCHASES,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: PurchasesComponent.DEFAULT_TAKE,
      },
    });

    this.purchases = (this.queryPurchases.valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.spinner.hide();
        this.loading = loading;
        this.purchases = data.purchases;
      },
      error: () => {
        this.error = true;
        this.spinner.hide();
      },
    }) as unknown) as Purchase[];
  }

  public fetchMore() {
    this.spinner.show();

    this.queryPurchases.fetchMore({
      variables: {
        skip: this.purchases.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.spinner.hide();

        if (!fetchMoreResult) {
          return prev;
        }

        return Object.assign({}, prev, {
          products: [...prev.purchases, ...fetchMoreResult.purchases],
        });
      },
    });
  }
}
