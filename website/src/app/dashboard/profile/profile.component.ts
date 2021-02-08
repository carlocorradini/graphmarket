import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { updateValues, User, UserGenders, UserService } from '../../core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  public static readonly MAX_UPLOAD_FILE_SIZE: number = 4194304;

  public user?: User;

  public readonly userGenders = Object.entries(UserGenders)
    .sort((a, b) => {
      return a[1].localeCompare(b[1]);
    })
    .map((gender) => [gender[0], gender[1].replace(/_/g, ' ')]);

  public readonly today: Date = new Date();

  public updateForm = new FormGroup({
    password: new FormControl(),
    name: new FormControl(),
    surname: new FormControl(),
    gender: new FormControl(),
    dateOfBirth: new FormControl(),
  });

  private avatar: File | null = null;

  public constructor(
    private readonly userService: UserService,
    private readonly spinner: NgxSpinnerService,
  ) {}

  public ngOnInit() {
    this.userService.user.subscribe((user) => {
      this.user = user;
      this.updateForm.get('gender')?.setValue(user?.gender);
    });
  }

  public handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    if (input.files[0].size > ProfileComponent.MAX_UPLOAD_FILE_SIZE) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: `You are allowed to upload a maximum file size of ${ProfileComponent.MAX_UPLOAD_FILE_SIZE}`,
      });
      return;
    }

    this.avatar = input.files[0];
  }

  public onSubmit(): void {
    this.spinner.show();

    const inputs = Object.keys(this.updateForm.value)
      .filter((k) => this.updateForm.value[k] !== null)
      .reduce((a, k) => ({ ...a, [k]: this.updateForm.value[k] }), {});

    forkJoin([
      this.userService.update(inputs as updateValues),
      ...(this.avatar ? [this.userService.updateAvatar(this.avatar)] : []),
    ])
      .pipe(
        finalize(() => {
          this.spinner.hide();
        }),
      )
      .subscribe(([user, userAvatar]) => {
        let errors = user && user.errors ? user.errors : undefined;
        if (!errors && userAvatar && userAvatar.errors) errors = userAvatar.errors;

        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (user && !user.data && userAvatar && !userAvatar.data)
          Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          if (userAvatar && userAvatar.data?.user)
            this.userService.updateAuthUser(userAvatar.data.user);
          if ('password' in inputs) {
            this.updateForm.get('password')?.reset();
            this.userService.removeAuthUser();
          }
          Swal.fire({ icon: 'success', title: 'Success', text: 'Updated successfully' }).then(
            () => {
              if ('password' in inputs) {
                Swal.fire({
                  icon: 'info',
                  title: 'Info',
                  text: 'Since you have changed the password you must re-authenticate',
                }).then(() => {
                  window.location.reload();
                });
              } else {
                window.location.reload();
              }
            },
          );
        }
      });
  }
}
