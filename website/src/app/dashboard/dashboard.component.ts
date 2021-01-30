import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../core';

@Component({ selector: 'app-dashboard-page', templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit {
  public user?: User;

  public constructor(private readonly userService: UserService) {}

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
