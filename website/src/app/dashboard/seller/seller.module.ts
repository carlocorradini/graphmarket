import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { InventoriesComponent } from './inventories/inventories.component';

@NgModule({
  imports: [CommonModule, SellerRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [SellerComponent, InventoriesComponent],
})
export class SellerModule {}
