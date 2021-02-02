import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User, UserRoles } from 'src/app/core';

/**
 * Header component.
 */
@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public user?: User;

  public isAuth: boolean;

  public searchProductForm = new FormGroup({
    productName: new FormControl(),
  });

  public userRoles = UserRoles;

  public constructor(private readonly router: Router, private readonly userService: UserService) {
    this.user = undefined;
    this.isAuth = false;
  }

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
    this.userService.isAuth.subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
  }

  public signOut(): void {
    this.userService.signOut();
    this.router.navigateByUrl('/');
  }

  public searchProduct() {
    const productName = this.searchProductForm.value['productName'];
    this.router.navigate(['/products'], { queryParams: { name: productName } });
  }

  public hasRole(role: UserRoles): boolean {
    return this.userService.authUserhasRole(role);
  }
}
