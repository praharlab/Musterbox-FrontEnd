import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffboardingsComponent } from './offboardings.component';
import { OffBoardingMasterComponent } from './off-boarding-master/off-boarding-master.component';

const routes: Routes = [
  {
    path: '',
    component: OffboardingsComponent,
    children: [
      { path: '', redirectTo: 'offboarding_master', pathMatch: 'full' },
      { path: 'offboarding_master', component: OffBoardingMasterComponent },

      { path: 'apply-resignation', loadChildren: () => import('./user-resignation/user-resignation-master.module').then((m) => m.UserResignationMasterModule) },

      { path: 'resignation-approval', loadChildren: () => import('./resignation-list/resignation-list-master.module').then((m) => m.ResignationListMasterModule) },

      { path: 'resignation-administration', loadChildren: () => import('./resignation-task/resignation-task-master.module').then((m) => m.ResignationTaskMasterModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffboardingsRoutingModule {}
