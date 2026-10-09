import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NetworkComponent } from './network/network.component';
import { PreboardingformComponent } from './preboardingform/preboardingform.component';
import { OtpComponent } from './otp/otp.component';
import { SubmitFormComponent } from './submit-form/submit-form.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { JobPostingDataComponent } from './job-posting-data/job-posting-data.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { LoginGuard } from 'src/app/shared/login.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard], },
      { path: 'preboarding/:id', component: PreboardingformComponent },
      { path: 'jobPosting/:id', component: JobPostingDataComponent },
      { path: 'applyJob/:id', component: ApplyJobComponent },
      { path: 'submitform/:id', component: SubmitFormComponent },
      { path: 'register', component: RegisterComponent, canActivate: [LoginGuard], },
      { path: 'otp', component: OtpComponent, canActivate: [LoginGuard], },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoginGuard], },
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard], },
      { path: 'resetpassword', component: ResetpasswordComponent, canActivate: [LoginGuard], },
      { path: 'network', component: NetworkComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
