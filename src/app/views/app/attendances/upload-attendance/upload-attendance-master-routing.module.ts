import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadAttendanceComponent } from './upload-attendance.component';


const routes: Routes = [
  { path: '', component: UploadAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadAttendanceMasterRoutingModule { }
