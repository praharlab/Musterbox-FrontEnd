import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeFoodAllowancePolicyComponent } from '../employee-food-allowance-policy/employee-food-allowance-policy.component';


const routes: Routes = [
  { path: '', component: EmployeeFoodAllowancePolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeFoodAllowancePolicyMasterRoutingModule { }
