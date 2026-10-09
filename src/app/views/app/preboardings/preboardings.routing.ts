import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreboardingsComponent } from './preboardings.component';
import { PreBordingMasterComponent } from './pre-bording-master/pre-bording-master.component';
import { AddPreboardingComponent } from './preboarding/add-preboarding/add-preboarding.component';
import { UserOnboardComponent } from './preboarding/user-onboard/user-onboard.component';

const routes: Routes = [
  {
    path: '',
    component: PreboardingsComponent,
    children: [
      { path: '', redirectTo: 'prebording_master', pathMatch: 'full' },
      { path: 'prebording_master', component: PreBordingMasterComponent },
      { path: 'user_preboarding', loadChildren: () => import('./preboarding/user-tab/preboarding-request-master.module').then((m) => m.PreboardingRequestMasterModule) },

      { path: 'hr_preboarding', loadChildren: () => import('./preboarding/hr-tab/hr-preboarding-master.module').then((m) => m.HrPreboardingMasterModule) },

      { path: 'user_onboard', component: UserOnboardComponent },

      { path: 'add_preboarding', component: AddPreboardingComponent },

      { path: 'preboarding_form', loadChildren: () => import('./preboarding-form/preboarding-form-master.module').then((m) => m.PreboardingFormMasterModule) },

      { path: 'jobPosting', loadChildren: () => import('./jobPosting/job-posting-master.module').then((m) => m.JobPostingMasterModule) },
      
      { path: 'jobApplication', loadChildren: () => import('./jobApplication/job-application-master.module').then((m) => m.JobApplicationMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreboardingsRoutingModule {}
