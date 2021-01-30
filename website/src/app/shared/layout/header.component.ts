import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from 'src/app/core';

/**
 * Header component.
 */
@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public user?: User;

  public constructor(private readonly router: Router, private readonly userService: UserService) {}

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }

  public signOut(): void {
    this.userService.signOut();
    this.router.navigateByUrl('/');
  }
}
