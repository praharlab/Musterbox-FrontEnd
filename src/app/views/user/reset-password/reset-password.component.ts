import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ResetPasswordComponent {
  @ViewChild('resetForm') resetForm: NgForm;
  emailModel = 'demo@vien.com';
  passwordModel = 'demovien1122';

  buttonDisabled = false;
  buttonState = '';

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showPassword1: boolean = false;

  togglePasswordVisibility1() {
    this.showPassword1 = !this.showPassword1;
  }

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.resetForm.valid && !this.buttonDisabled) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';

      const body = {
        mobile: localStorage.getItem('mobile'),
        new_password: this.resetForm.value.newPassword,
      };

      if (this.resetForm.value.newPassword == this.resetForm.value.confPassword) {
        this.api.callApi(this.constant.RESETPASS, body, 'POST', true, false, false).subscribe(
          (res: any) => {
            if (res.status == 200) {
              localStorage.clear();
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 2000,
                showProgressBar: true,
              });

              setTimeout(() => {
                this.buttonDisabled = false;
                this.buttonState = '';
                this.router.navigate(['user/login']);
              }, 2000);
            } else {
              this.notifications.create('Error', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.buttonDisabled = false;
              this.buttonState = '';
            }
          },
          (err) => {
            this.notifications.create('Error', err, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.buttonDisabled = false;
            this.buttonState = '';
          },
        );
      } else {
        this.notifications.create(
          'Error',
          'Password and confirm password are not same..',
          NotificationType.Bare,
          { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
        );
        this.buttonDisabled = false;
        this.buttonState = '';
      }
    }
  }
}
