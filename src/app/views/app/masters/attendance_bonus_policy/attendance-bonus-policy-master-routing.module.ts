import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAttendanceBonusPolicyComponent } from './list-attendance-bonus-policy/list-attendance-bonus-policy.component';
import { AddAttendanceBonusPolicyComponent } from './add-attendance-bonus-policy/add-attendance-bonus-policy.component';
import { EditAttendanceBonusPolicyComponent } from './edit-attendance-bonus-policy/edit-attendance-bonus-policy.component';


const routes: Routes = [
  { path: '', component: ListAttendanceBonusPolicyComponent },
  { path: 'add_attendance_bonus_policy', component: AddAttendanceBonusPolicyComponent },
  { path: 'edit_attendance_bonus_policy', component: EditAttendanceBonusPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceBonusPolicyMasterRoutingModule { }
