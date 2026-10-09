import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAttendancepolicyComponent } from './list-attendancepolicy/list-attendancepolicy.component';
import { AddAttendancepolicyComponent } from './add-attendancepolicy/add-attendancepolicy.component';
import { EditAttendancepolicyComponent } from './edit-attendancepolicy/edit-attendancepolicy.component';


const routes: Routes = [
  { path: '', component: ListAttendancepolicyComponent },
  { path: 'add_attendance_policy', component: AddAttendancepolicyComponent },
  { path: 'edit_attendance_policy', component: EditAttendancepolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancePolicyMasterRoutingModule { }
