import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isUUID } from 'class-validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../core';

@Component({ selector: 'app-verify-page', templateUrl: './verify.component.html' })
export class VerifyComponent implements OnInit {
  public verifyForm = new FormGroup({
    phoneCode: new FormControl(),
    emailCode: new FormControl(),
  });

  private userId: string;

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly spinner: NgxSpinnerService,
    private readonly toastr: ToastrService,
  ) {
    this.userId = '';
  }

  public ngOnInit(): void {
    const userId: string | null = this.route.snapshot.paramMap.get('userId');
    const context: string | null = this.route.snapshot.queryParamMap.get('context');

    if (!isUUID(userId)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops',
        html: `User <br/>
        <span class="uk-text-bold">${userId}</span><br/>
        is invalid`,
      });
    }

    this.showInfoByContext(context);

    this.userId = userId as string;
  }

  private showInfoByContext(context: string | null) {
    switch (context) {
      case 'signin': {
        this.toastr.info('You must be verified to execute any actions');
        this.toastr.success('Successfully signed on');
        break;
      }
      case 'signup': {
        this.toastr.info(
          `We have send a verification code to the phone number and email you provided.
          <br/>
          Please verify yourself`,
        );
        this.toastr.success('Successfully signed up');
        break;
      }
      default: {
        console.warn(`Received unknown context: ${context}`);
      }
    }
  }

  public onSubmit(): void {
    this.spinner.show();

    this.userService
      .verify(this.userId, this.verifyForm.value.phoneCode, this.verifyForm.value.emailCode)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (errors) {
          Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        } else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          this.userService.setAuthUser(data.token);
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  public resend(): void {
    this.spinner.show();

    this.userService
      .reVerify(this.userId)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(({ data, errors }) => {
        if (errors) {
          Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        } else if (!data) Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          Swal.fire({
            icon: 'success',
            title: 'Successfull',
            text: 'New verification codes sended',
          });
        }
      });
  }
}
