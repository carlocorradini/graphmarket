import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product.component';

/**
 * Products routes.
 */
const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: ':productId',
    component: ProductComponent,
  },
];

/**
 * Products routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
