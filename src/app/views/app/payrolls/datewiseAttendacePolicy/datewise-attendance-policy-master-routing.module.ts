import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDatewiseAttendancePolicyComponent } from './list-datewise-attendance-policy/list-datewise-attendance-policy.component';
import { AddDatewiseAttendancePolicyComponent } from './add-datewise-attendance-policy/add-datewise-attendance-policy.component';
import { EditDatewiseAttendancePolicyComponent } from './edit-datewise-attendance-policy/edit-datewise-attendance-policy.component';


const routes: Routes = [
  { path: '', component: ListDatewiseAttendancePolicyComponent },
  { path: 'add_datewiseAttendancePolicy', component: AddDatewiseAttendancePolicyComponent },
  { path: 'edit_datewiseAttendancePolicy', component: EditDatewiseAttendancePolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatewiseAttendancePolicyMasterRoutingModule { }
