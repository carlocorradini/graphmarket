import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseService, TokenService, UserService } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [TokenService, UserService, PurchaseService],
})
export class CoreModule {}
