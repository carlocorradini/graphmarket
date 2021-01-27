import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

/**
 * Products module.
 */
@NgModule({
  imports: [CommonModule, ProductsRoutingModule, StarRatingModule.forChild()],
  declarations: [ProductsComponent],
})
export class ProductsModule {}
