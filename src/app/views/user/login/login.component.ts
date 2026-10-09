import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChatNotificationCountService } from 'src/app/services/chat-notification-count.service';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginForm') loginForm: NgForm;
  buttonDisabled = false;
  buttonState = '';
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  LoginPageLabel: any = labelUtils.LoginPageLabel
  constructor(
    private renderer: Renderer2,
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private chatNotificationCountService: ChatNotificationCountService,
  ) { }

  ngOnInit(): void {
    // The shared auth shell wraps every /user route in a Bootstrap .container,
    // which boxes the split-screen layout in and clips it on small viewports.
    // This class lets the login view run edge to edge without affecting the
    // other auth pages, which are meant to stay centred cards.
    this.renderer.addClass(document.body, 'login-fullbleed');
    this.chatNotificationCountService.logout();
    this.chatNotificationCountService.chatBotHide();
    sessionStorage.clear();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'login-fullbleed');
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    let body = this.loginForm.value;
    this.api.callApi(this.constant.LOGIN, body, 'POST', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          if (res.data.resetpassword == 1) {
            // localStorage.setItem('user', JSON.stringify(res.data));
            // localStorage.setItem('token', res.data.token);
            localStorage.setItem('resetID', res.data.usermasterid);
            // localStorage.setItem('company_id', res.data.companyMasterID);
            // localStorage.setItem('childcompany', res.data.childcompany);
            // localStorage.setItem('usertype', res.data.admin);

            // environment.permission=res.data.permission;
            // localStorage.setItem(
            //   'permission',
            //   JSON.stringify(res.data.permission),
            // )
            this.notifications.create('Done', 'Please reset your password', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 2000,
              showProgressBar: true,
            });

            setTimeout(() => {
              // this.router.navigate(['app/dashboards']);
              this.buttonDisabled = false;
              this.buttonState = '';
              this.router.navigate(['user/resetpassword']).then(() => {
                // window.location.reload()
                this.spinner.stop();
              });
            }, 2000);
          } else if (res.data.admin == 2 || res.data.admin == 3) {
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('id', res.data.usermasterid);
            localStorage.setItem('usertype', res.data.admin);
            localStorage.setItem('company_id', res.data.companyMasterID);

            this.router.navigate(['app/dashboards/default']).then(() => {
              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop();
            });
          }
          else if (res.data.admin == 4) {
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('id', res.data.usermasterid);
            localStorage.setItem('usertype', res.data.admin);
            localStorage.setItem('company_id', res.data.companyMasterID);

            this.router.navigate(['app/masters/company_master']).then(() => {
              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop();
            });
          }
          else {
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('id', res.data.usermasterid);
            localStorage.setItem('company_id', res.data.companyMasterID);
            localStorage.setItem('childcompany', res.data.childcompany);
            localStorage.setItem('usertype', res.data.admin);

            this.router.navigate(['app/dashboards/analytics']).then(() => {
              this.buttonDisabled = false;
              this.buttonState = '';
            });
          }
        } else {
          this.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError('Something Went Wrong!');
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
