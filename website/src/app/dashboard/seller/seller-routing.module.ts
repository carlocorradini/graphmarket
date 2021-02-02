import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerComponent } from './seller.component';
import { InventoriesComponent } from './inventories/inventories.component';

const routes: Routes = [
  {
    path: '',
    component: SellerComponent,
  },
  {
    path: 'inventories',
    component: InventoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerRoutingModule {}
