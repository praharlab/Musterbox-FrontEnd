import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOrgAuthorizationComponent } from './list-org-authorization/list-org-authorization.component';
import { AddOrgAuthorizationComponent } from './add-org-authorization/add-org-authorization.component';
import { EditOrgAuthorizationComponent } from './edit-org-authorization/edit-org-authorization.component';


const routes: Routes = [
  { path: '', component: ListOrgAuthorizationComponent },
  { path: 'add', component: AddOrgAuthorizationComponent },
  { path: 'edit', component: EditOrgAuthorizationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationAuthorizationRoutingModule { }
