import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOrgAuthTypeComponent } from './list-org-auth-type/list-org-auth-type.component';
import { AddOrgAuthTypeComponent } from './add-org-auth-type/add-org-auth-type.component';
import { EditOrgAuthTypeComponent } from './edit-org-auth-type/edit-org-auth-type.component';


const routes: Routes = [
  { path: '', component: ListOrgAuthTypeComponent },
  { path: 'add', component: AddOrgAuthTypeComponent },
  { path: 'edit', component: EditOrgAuthTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgAuthorizationTypeRoutingModule { }
