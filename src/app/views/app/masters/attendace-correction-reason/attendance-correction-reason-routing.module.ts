import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAttendanceCorrectionReasonComponent } from './list-attendance-correction-reason/list-attendance-correction-reason.component';
import { AddAttendanceCorrectionReasonComponent } from './add-attendance-correction-reason/add-attendance-correction-reason.component';
import { EditAttendanceCorrectionReasonComponent } from './edit-attendance-correction-reason/edit-attendance-correction-reason.component';

const routes: Routes = [
  { path: '', component: ListAttendanceCorrectionReasonComponent },
  { path: 'add_attendance_correction_reason', component: AddAttendanceCorrectionReasonComponent },
  { path: 'edit_attendance_correction_reason', component: EditAttendanceCorrectionReasonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceCorrectionReasonRoutingModule { }
