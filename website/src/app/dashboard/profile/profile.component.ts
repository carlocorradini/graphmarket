import { Component } from '@angular/core';
import { User, UserService } from 'src/app/core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  public user?: User;

  public constructor(private readonly userService: UserService) {}

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
