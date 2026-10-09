import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ForgotPasswordComponent {
  @ViewChild('passwordForm') passwordForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.passwordForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    const body = this.passwordForm.value;
    this.api.callApi(this.constant.FORGOTPASS, body, 'POST', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          localStorage.setItem('mobile', this.passwordForm.value.mobile);
          localStorage.setItem('otp', res.data.otp);
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 2000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.buttonDisabled = false;
            this.buttonState = '';
            this.router.navigate(['user/otp']);
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
  }
}
