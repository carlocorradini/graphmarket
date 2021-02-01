import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from './core/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  public constructor(private readonly router: Router, private readonly userService: UserService) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.userService.isAuth.pipe(
      take(1),
      map((isAuth) => {
        if (isAuth) return true;

        this.router.navigateByUrl('/signin');
        return true;
      }),
    );
  }

  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.userService.isAuth.pipe(
      take(1),
      map((isAuth) => {
        if (isAuth) return true;

        this.router.navigateByUrl('/signin');
        return true;
      }),
    );
  }
}
