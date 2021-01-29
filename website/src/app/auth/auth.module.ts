import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';

@NgModule({ providers: [AuthGuard] })
export class AuthModule {}
