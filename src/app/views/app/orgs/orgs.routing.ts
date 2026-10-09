import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgsComponent } from './orgs.component';
import { OrgmasterComponent } from './orgmaster/orgmaster.component';

const routes: Routes = [
  {
    path: '',
    component: OrgsComponent,
    children: [
      { path: '', redirectTo: 'org_master', pathMatch: 'full' },
      { path: 'org_master', component: OrgmasterComponent },

      { path: 'authorization', loadChildren: () => import('./authorization/authorization-master.module').then((m) => m.AuthorizationMasterModule) },

      { path: 'roles', loadChildren: () => import('./roles/roles-master.module').then((m) => m.RolesMasterModule) },

      { path: 'assignrole', loadChildren: () => import('./assign-role/assign-role-master.module').then((m) => m.AssignRoleMasterModule) },

      { path: 'listPolicyDocuments', loadChildren: () => import('./policy-documents/policy-documents-master.module').then((m) => m.PolicyDocumentsMasterModule) },

      { path: 'team_location_tracking', loadChildren: () => import('./team-location-tracking/team-location-tracking-master.module').then((m) => m.TeamLocationTrackingMasterModule) },

      { path: 'change_password', loadChildren: () => import('./changepasswordnew/change-password-master.module').then((m) => m.ChangePasswordMasterModule) },

      { path: 'listAuthDetails', loadChildren: () => import('./list-auth-details/list-auth-details-master.module').then((m) => m.ListAuthDetailsMasterModule) },

      { path: 'replaceAuthDetails', loadChildren: () => import('./replace-auth-details/replace-auth-details-master.module').then((m) => m.ReplaceAuthDetailsMasterModule) },

      { path: 'anonymousfeedback', loadChildren: () => import('./anonymous-feedback/list-anonymous-feedback/anonymous-feedback-master.module').then((m) => m.AnonymousFeedbackMasterModule) },

      { path: 'trackingDashboard', loadChildren: () => import('./tracking-dashboard/tracking-dashboard.module').then((m) => m.TrackingDashboardModule) },

      { path: 'orgAuthorization', loadChildren: () => import('./organization-authorization/organization-authorization.module').then((m) => m.OrganizationAuthorizationModule) }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgsRoutingModule { }
