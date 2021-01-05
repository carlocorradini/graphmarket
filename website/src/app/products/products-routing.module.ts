import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';

/**
 * Products routes.
 */
const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
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
