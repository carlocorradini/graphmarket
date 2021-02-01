import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserRoles, UserService } from 'src/app/core';

@Injectable()
export class AdminAuthGuard implements CanActivate, CanActivateChild {
  public constructor(private readonly router: Router, private readonly userService: UserService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.userService.authUserhasRole(UserRoles.ADMINISTRATOR);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.userService.authUserhasRole(UserRoles.ADMINISTRATOR);
  }
}
