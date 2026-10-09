import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    children: [
      // { path: '', redirectTo: 'profile-status-tab', pathMatch: 'full' },

      { path: 'profile-status-tab', loadChildren: () => import('./profile-status-tab/profile-status-tab.module').then((m) => m.ProfileStatusTabModule) },

      { path: 'expiry-document-tab', loadChildren: () => import('./expiry-document-tab/expiry-document-tab.module').then((m) => m.ExpiryDocumentTabModule) },
      
      { path: 'to-be-confirmed-employee-tab', loadChildren: () => import('./to-be-confirmed-employee-tab/to-be-confirmed-employee-tab.module').then((m) => m.ToBeConfirmedEmployeeTabModule) },
      
      { path: 'expiry-joining-document-tab', loadChildren: () => import('./expiry-joining-document-tab/expiry-joining-document-tab.module').then((m) => m.ExpiryJoiningDocumentTabModule) },
      
      { path: 'assign-biometric-code-users', loadChildren: () => import('./assign-biometric-user-list/assign-biometric-user-list.module').then((m) => m.AssignBiometricUserListModule) },

      { path: 'unassigned-Employee-code', loadChildren: () => import('./unassigned-biometric-code/unassigned-biometric-code.module').then((m) => m.UnassignedBiometricCodeModule) },

      { path: 'assigned-shift', loadChildren: () => import('./employee-shift-report/employee-shift-report.module').then((m) => m.EmployeeShiftReportModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { }
