import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationPolicyComponent } from './notification-policy.component';


const routes: Routes = [
  { path: '', component: NotificationPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationPolicyMasterRoutingModule { }
