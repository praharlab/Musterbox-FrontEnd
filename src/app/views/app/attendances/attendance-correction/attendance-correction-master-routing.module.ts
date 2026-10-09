import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAttendanceCorrectionRequestComponent } from './add-attendance-correction-request/add-attendance-correction-request.component';
import { EditAttendanceCorrectionRequestComponent } from './edit-attendance-correction-request/edit-attendance-correction-request.component';
import { ListAttendanceCorrectionRequestComponent } from './list-attendance-correction-request/list-attendance-correction-request.component';


const routes: Routes = [
  { path: '', component: ListAttendanceCorrectionRequestComponent },
  { path: 'add_attendance_correction_request', component: AddAttendanceCorrectionRequestComponent },
  { path: 'edit_attendance_correction_request', component: EditAttendanceCorrectionRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceCorrectionMasterRoutingModule { }
