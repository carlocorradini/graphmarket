import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserRoles, UserService } from 'src/app/core';

@Injectable()
export class SellerAuthGuard implements CanActivate, CanActivateChild {
  public constructor(private readonly router: Router, private readonly userService: UserService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.userService.authUserhasRole(UserRoles.SELLER);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.userService.authUserhasRole(UserRoles.SELLER);
  }
}
