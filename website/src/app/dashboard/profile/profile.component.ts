import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { updateValues, User, UserGenders, UserService } from 'src/app/core';
import Swal from 'sweetalert2';

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
    });
  }

  public handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
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
        let errors = user.errors;
        if (!errors && userAvatar.errors) errors = userAvatar.errors;

        if (errors) Swal.fire({ icon: 'warning', title: 'Oops...', text: errors[0].message });
        else if (!user.data || !userAvatar.data)
          Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Unknown error' });
        else {
          this.userService.updateAuthUser(userAvatar.data?.user);
          Swal.fire({ icon: 'success', title: 'Success', text: 'Updated successfully' });
        }
      });
  }
}
