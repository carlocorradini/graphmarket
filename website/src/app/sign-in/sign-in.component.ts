import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  public signInForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  public constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  public onSubmit(): void {
    this.spinner.show();
    
    this.userService
      .signIn(this.signInForm.value.username, this.signInForm.value.password)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (
          errors &&
          errors.length > 0 &&
          errors[0].message == 'Verification missing to execute the procedure'
        ) {
          this.router.navigate(['verify', errors[0]!.extensions!.exception!.userId], {
            queryParams: { context: 'signin' },
          });
        } else if (errors) {
          Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        } else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          this.userService.setAuthUser(data.token);
          this.router.navigateByUrl('/dashboard');
        }
      });
  }
}
