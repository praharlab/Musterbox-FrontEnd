import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeWeekoffPolicyComponent } from './employee-weekoff-policy/employee-weekoff-policy.component';


const routes: Routes = [
  { path: '', component: EmployeeWeekoffPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeWeekoffPolicyMasterRoutingModule { }
