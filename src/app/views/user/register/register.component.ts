import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(
    private authService: AuthService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.registerForm.valid && !this.buttonDisabled) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';

      this.authService
        .register(this.registerForm.value)
        .then((user) => {
          this.router.navigate([environment.adminRoot]);
        })
        .catch((error) => {
          this.notifications.create('Error', error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
        });
    }
  }
}
