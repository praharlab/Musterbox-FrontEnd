import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLeaveEncashmentComponent } from '../list-leave-encashment/list-leave-encashment.component';


const routes: Routes = [
  { path: '', component: ListLeaveEncashmentComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveEncashmentRoutingModule { }
