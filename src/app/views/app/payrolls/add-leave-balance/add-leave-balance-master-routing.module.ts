import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLeaveBalanceComponent } from './add-leave-balance.component';


const routes: Routes = [
  { path: '', component: AddLeaveBalanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLeaveBalanceMasterRoutingModule { }
