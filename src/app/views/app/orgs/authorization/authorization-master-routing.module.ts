import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAuthorizationComponent } from './list-authorization/list-authorization.component';
import { AddAuthorizationComponent } from './add-authorization/add-authorization.component';
import { EditAuthorizationComponent } from './edit-authorization/edit-authorization.component';
import { ImportAuthorizationComponent } from '../import-authorization/import-authorization.component';


const routes: Routes = [
  { path: '', component: ListAuthorizationComponent },
  { path: 'add_authorization', component: AddAuthorizationComponent },
  { path: 'edit_authorization', component: EditAuthorizationComponent },
  { path: 'import_authorization', component: ImportAuthorizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationMasterRoutingModule { }
