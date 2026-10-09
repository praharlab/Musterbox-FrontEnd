import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAttendanceBonusPolicyComponent } from './employee-attendance-bonus-policy/employee-attendance-bonus-policy.component';


const routes: Routes = [
  { path: '', component: EmployeeAttendanceBonusPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceBonusPolicyMasterRoutingModule { }
