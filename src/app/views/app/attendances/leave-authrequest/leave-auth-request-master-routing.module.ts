import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveAuthrequestComponent } from './leave-authrequest.component';


const routes: Routes = [
  { path: '', component: LeaveAuthrequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveAuthRequestMasterRoutingModule { }
