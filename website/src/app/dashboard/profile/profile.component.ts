import { Component } from '@angular/core';
import { User, UserGenders, UserService } from 'src/app/core';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  public user?: User;

  public readonly userGenders = Object.entries(UserGenders)
    .sort((a, b) => {
      return a[1].localeCompare(b[1]);
    })
    .map((gender) => [gender[0], gender[1].replace(/_/g, ' ')]);

  public constructor(private readonly userService: UserService) {}

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
