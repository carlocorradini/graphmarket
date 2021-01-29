import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TokenService, UserService } from '../core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  public signInForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  public constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {}

  public onSubmit(): void {
    this.spinner.show();
    this.userService
      .signIn(this.signInForm.value.username, this.signInForm.value.password)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(
        ({ data, errors }) => {
          if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
          else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
          else {
            this.tokenService.setToken(data.token);
            this.userService.populate();
            this.router.navigateByUrl('/dashboard');
          }
        },
        (error) => {
          alert(error);
        },
      );
  }
}
