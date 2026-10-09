import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAttendancePolicyComponent } from '../../employee-attendance-policy/employee-attendance-policy.component';


const routes: Routes = [
  { path: '', component: EmployeeAttendancePolicyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancePolicyMasterRoutingModule { }
