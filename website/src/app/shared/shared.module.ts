import { NgModule } from '@angular/core';
import { ShowAuthDirective } from './show-auth.directive';

@NgModule({
  declarations: [ShowAuthDirective],
  exports: [ShowAuthDirective],
})
export class SharedModule {}
