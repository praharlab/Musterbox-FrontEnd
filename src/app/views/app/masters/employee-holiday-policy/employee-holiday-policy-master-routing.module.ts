import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeHolidayPolicyComponent } from './employee-holiday-policy/employee-holiday-policy.component';


const routes: Routes = [
  { path: '', component: EmployeeHolidayPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeHolidayPolicyMasterRoutingModule { }
