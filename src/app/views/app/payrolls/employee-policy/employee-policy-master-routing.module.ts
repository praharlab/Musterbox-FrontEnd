import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePolicyComponent } from './employee-policy.component';


const routes: Routes = [
  { path: '', component: EmployeePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePolicyMasterRoutingModule { }
