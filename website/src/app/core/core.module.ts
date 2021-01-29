import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TokenService, UserService } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [TokenService, UserService],
})
export class CoreModule {}
