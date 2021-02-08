import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { User, UserService } from '../core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({ selector: 'app-user-page', templateUrl: './user.component.html' })
export class UserComponent implements OnInit {
  public user?: User;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  public ngOnInit(): void {
    const userId: string | null = this.route.snapshot.paramMap.get('userId');

    if (userId === null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        html: `User <br/>
        <span class="uk-text-bold">${userId}</span><br/>
        is invalid`,
      });
    } else {
      this.loadUser(userId);
    }
  }

  private loadUser(userId: string) {
    this.spinner.show();

    this.userService
      .userById(userId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data }) => {
        if (!data.user)
          Swal.fire({
            icon: 'error',
            title: 'Oops',
            html: `User<br/>
            <span class="uk-text-bold">${userId}</span><br/>
            not found`,
          });
        else this.user = data.user;
      });
  }
}
