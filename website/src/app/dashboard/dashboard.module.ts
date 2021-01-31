import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchasesComponent } from './purchases/purchases.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [DashboardComponent, ProfileComponent, PurchasesComponent],
})
export class DashboardModule {}
