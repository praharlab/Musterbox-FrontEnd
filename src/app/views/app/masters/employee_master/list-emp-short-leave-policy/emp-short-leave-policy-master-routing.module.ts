import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmpShortLeavePolicyComponent } from './list-emp-short-leave-policy.component';


const routes: Routes = [
  { path: '', component: ListEmpShortLeavePolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpShortLeavePolicyMasterRoutingModule { }
