import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Review } from 'src/app/core';
import Swal from 'sweetalert2';

const QUERY_REVIEWS = gql`
  query Reviews($skip: NonNegativeInt, $take: PositiveInt) {
    me {
      reviews(skip: $skip, take: $take) {
        id
        title
        body
        rating
        createdAt
        product {
          id
          cover
          name
        }
      }
    }
  }
`;

const MUTATION_DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: UUID!) {
    deleteReview(id: $reviewId) {
      id
    }
  }
`;

const MUTATION_CREATE_REVIEW = gql`
  mutation CreateReview(
    $productId: UUID!
    $title: NonEmptyString
    $body: NonEmptyString
    $rating: ProductRating!
  ) {
    createReview(productId: $productId, data: { title: $title, body: $body, rating: $rating }) {
      id
    }
  }
`;

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  public static readonly DEFAULT_TAKE: number = 8;

  public reviews: Review[];

  public loading: boolean;

  public error: boolean;

  private queryReviews!: QueryRef<{ me: { reviews: Review[] } }>;

  public createReviewForm = new FormGroup({
    productId: new FormControl(),
    title: new FormControl(),
    body: new FormControl(),
    rating: new FormControl('1'),
  });

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly apollo: Apollo,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.reviews = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    const productId: string | null = this.route.snapshot.queryParamMap.get('productId');

    if (productId) {
      this.createReviewForm.get('productId')?.setValue(productId);
    }

    this.spinner.show();

    this.queryReviews = this.apollo.watchQuery<{ me: { reviews: Review[] } }>({
      query: QUERY_REVIEWS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: ReviewsComponent.DEFAULT_TAKE,
      },
    });

    this.reviews = (this.queryReviews.valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.spinner.hide();
        this.loading = loading;
        this.reviews = data.me.reviews;
      },
      error: () => {
        this.error = true;
        this.spinner.hide();
      },
    }) as unknown) as Review[];
  }

  public fetchMore() {
    this.spinner.show();

    this.queryReviews.fetchMore({
      variables: {
        skip: this.reviews.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.spinner.hide();

        if (!fetchMoreResult) {
          return prev;
        }

        return Object.assign({}, prev, {
          me: {
            reviews: [...prev.me.reviews, ...fetchMoreResult.me.reviews],
          },
        });
      },
    });
  }

  public deleteReview(reviewId: string) {
    this.spinner.show();

    this.apollo
      .mutate({
        mutation: MUTATION_DELETE_REVIEW,
        errorPolicy: 'all',
        variables: { reviewId },
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
            html: `Review<br/>
              ${reviewId}<br/>
              successfully deleted`,
          }).then(() => location.reload());
        }
      });
  }

  public onCreateReviewSubmit() {
    this.spinner.show();

    const inputs = Object.keys(this.createReviewForm.value)
      .filter((k) => this.createReviewForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.createReviewForm.value[k] }), {});

    this.apollo
      .mutate({ mutation: MUTATION_CREATE_REVIEW, errorPolicy: 'all', variables: inputs })
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
            text: 'Review created successfully',
          }).then(() => location.reload());
        }
      });
  }
}
