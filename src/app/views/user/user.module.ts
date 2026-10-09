import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PreboardingformComponent } from './preboardingform/preboardingform.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OtpComponent } from './otp/otp.component';
import { SubmitFormComponent } from './submit-form/submit-form.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { NgxSignaturePadModule } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { JobPostingDataComponent } from './job-posting-data/job-posting-data.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UserComponent,
    ResetPasswordComponent,
    PreboardingformComponent,
    OtpComponent,
    SubmitFormComponent,
    ResetpasswordComponent,
    JobPostingDataComponent,
    ApplyJobComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgxUiLoaderModule,
    NgSelectModule,
    NgxSignaturePadModule
  ],
})
export class UserModule { }
