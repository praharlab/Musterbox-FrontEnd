import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListManageLeaveBalanceComponent } from './list-manage-leave-balance/list-manage-leave-balance.component';
import { ManageLeaveBalanceComponent } from './manage-leave-balance/manage-leave-balance.component';
import { ViewLeaveBalanceComponent } from './view-leave-balance/view-leave-balance.component';


const routes: Routes = [
  { path: '', component: ListManageLeaveBalanceComponent },
  { path: 'add', component: ManageLeaveBalanceComponent },
  { path: 'view', component: ViewLeaveBalanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLeaveBalanceMasterRoutingModule { }
