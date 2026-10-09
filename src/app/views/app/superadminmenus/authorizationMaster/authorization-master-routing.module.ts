import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAuthorizationmasterComponent } from './list-authorizationmaster/list-authorizationmaster.component';
import { AddAuthorizationmasterComponent } from './add-authorizationmaster/add-authorizationmaster.component';
import { EditAuthorizationmasterComponent } from './edit-authorizationmaster/edit-authorizationmaster.component';


const routes: Routes = [
  { path: '', component: ListAuthorizationmasterComponent },
  { path: 'add_auth_master', component: AddAuthorizationmasterComponent },
  { path: 'edit_auth_master', component: EditAuthorizationmasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationMasterRoutingModule { }
