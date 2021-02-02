import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [AdminComponent, ProductsComponent],
})
export class AdminModule {}
