import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, forkJoin } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { Product, ProductCategories } from 'src/app/core';
import Swal from 'sweetalert2';
declare var UIkit: any;

const QUERY_PRODUCTS = gql`
  query Products($skip: NonNegativeInt, $take: PositiveInt, $name: NonEmptyString) {
    products(skip: $skip, take: $take, name: $name) {
      id
      category
      cover
      name
      description
      createdAt
      updatedAt
    }
  }
`;

const QUERY_PRODUCT = gql`
  query Product($id: UUID!) {
    product(id: $id) {
      id
      category
      name
      description
    }
  }
`;

const MUTATION_ADD_PRODUCT = gql`
  mutation AddProduct(
    $category: ProductCategories!
    $name: NonEmptyString!
    $description: NonEmptyString
  ) {
    product: createProduct(data: { category: $category, name: $name, description: $description }) {
      id
    }
  }
`;

const MUTATION_UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $productId: UUID!
    $category: ProductCategories
    $name: NonEmptyString
    $description: NonEmptyString
  ) {
    product: updateProduct(
      id: $productId
      data: { category: $category, name: $name, description: $description }
    ) {
      id
    }
  }
`;

const MUTATION_UPDATE_PRODUCT_PHOTO = gql`
  mutation UpdateProductPhoto($productId: UUID!, $photo: Upload!) {
    product: updateProductPhoto(id: $productId, file: $photo) {
      id
    }
  }
`;

@Component({ templateUrl: './products.component.html' })
export class ProductsComponent implements OnInit {
  public static readonly DEFAULT_TAKE: number = 8;

  public static readonly MAX_UPLOAD_FILES: number = 8;

  public products: Product[];

  public loading: boolean;

  public error: boolean;

  private queryProducts!: QueryRef<{ products: Product[] }>;

  public createProductForm = new FormGroup({
    category: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
  });

  private photos: File[] = [];

  public updateProductForm = new FormGroup({
    productId: new FormControl(),
    category: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
  });

  public readonly productCategories = Object.entries(ProductCategories)
    .sort((a, b) => {
      return a[1].localeCompare(b[1]);
    })
    .map((category) => [category[0], category[1].replace(/_/g, ' ')]);

  public constructor(private readonly apollo: Apollo, private readonly spinner: NgxSpinnerService) {
    this.products = [];
    this.loading = true;
    this.error = false;
  }

  public ngOnInit(): void {
    this.spinner.show();

    this.queryProducts = this.apollo.watchQuery<{ products: Product[] }>({
      query: QUERY_PRODUCTS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      variables: {
        skip: 0,
        take: ProductsComponent.DEFAULT_TAKE,
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

  public onCreateProductSubmit() {
    this.spinner.show();

    const inputs = Object.keys(this.createProductForm.value)
      .filter((k) => this.createProductForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.createProductForm.value[k] }), {});

    this.apollo
      .mutate<{ product: { id: string } }>({
        mutation: MUTATION_ADD_PRODUCT,
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
            html: `Product<br/>
            ${data.product.id}<br/>F
            created successfully`,
          });
        }
      });
  }

  public editProduct(productId: string) {
    this.spinner.show();

    this.apollo
      .query<{ product: Product }>({
        query: QUERY_PRODUCT,
        errorPolicy: 'all',
        variables: { id: productId },
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
          this.updateProductForm.get('productId')?.setValue(data.product.id);
          this.updateProductForm.get('category')?.setValue(data.product.category);
          this.updateProductForm.get('name')?.setValue(data.product.name);
          this.updateProductForm.get('description')?.setValue(data.product.description);
          UIkit.tab(document.getElementById('products-tab')).show(2);
        }
      });
  }

  public handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    if (input.files.length > ProductsComponent.MAX_UPLOAD_FILES) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: `You are allowed to upload a maximum of ${ProductsComponent.MAX_UPLOAD_FILES}`,
      });
      return;
    }

    this.photos = Array.from(input.files);
  }

  public onUpdateProductSubmit() {
    this.spinner.show();

    const inputs = Object.keys(this.updateProductForm.value)
      .filter((k) => this.updateProductForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.updateProductForm.value[k] }), {});

    this.apollo
      .mutate<{ product: { id: string } }>({
        mutation: MUTATION_UPDATE_PRODUCT,
        errorPolicy: 'all',
        variables: inputs,
      })
      .pipe(
        concatMap(() =>
          concat(
            ...this.photos.map((photo) =>
              this.apollo.mutate<{ product: { id: string } }>({
                mutation: MUTATION_UPDATE_PRODUCT_PHOTO,
                errorPolicy: 'all',
                variables: {
                  productId: this.updateProductForm.get('productId')?.value,
                  photo,
                },
                context: {
                  useMultipart: true,
                },
              }),
            ),
          ),
        ),
      )
      .pipe(
        finalize(() => {
          this.spinner.hide();
          Swal.fire({ icon: 'success', title: 'Success', text: 'Updated successfully' });
        }),
      )
      .subscribe(
        () => {},
        (error) => {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: Array.isArray(error) ? error[0].message : error.message,
          });
        },
      );
  }
}
