import { Component, OnInit } from '@angular/core';
import { gql } from 'apollo-angular';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      name
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


  ngOnInit(): void {
  }
}
