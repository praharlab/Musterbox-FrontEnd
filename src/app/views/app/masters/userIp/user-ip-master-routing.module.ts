import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserIpComponent } from './list-user-ip/list-user-ip.component';
import { AddUserIpComponent } from './add-user-ip/add-user-ip.component';
import { EditUserIpComponent } from './edit-user-ip/edit-user-ip.component';


const routes: Routes = [
  { path: '', component: ListUserIpComponent },
  { path: 'add_userIp', component: AddUserIpComponent },
  { path: 'edit_userIp', component: EditUserIpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserIpMasterRoutingModule { }
