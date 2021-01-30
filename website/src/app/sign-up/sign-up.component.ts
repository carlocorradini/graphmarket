import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SignUpValues, UserGenders, UserService } from '../core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  public readonly userGenders = Object.entries(UserGenders)
    .sort((a, b) => {
      return a[1].localeCompare(b[1]);
    })
    .map((gender) => [gender[0], gender[1].replace(/_/g, ' ')]);

  public readonly today: Date = new Date();

  public signUpForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    name: new FormControl(),
    surname: new FormControl(),
    gender: new FormControl(),
    dateOfBirth: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
  });

  public constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  public onSubmit(): void {
    this.spinner.show();

    const inputs = Object.keys(this.signUpForm.value)
      .filter((k) => this.signUpForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.signUpForm.value[k] }), {});

    this.userService
      .signUp(inputs as SignUpValues)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          this.router.navigate(['verify', data.user.id], { queryParams: { context: 'signup' } });
        }
      });
  }
}
