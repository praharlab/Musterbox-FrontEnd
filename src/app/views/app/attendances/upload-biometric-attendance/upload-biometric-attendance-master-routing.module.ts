import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadBiometricAttendanceComponent } from './upload-biometric-attendance.component';


const routes: Routes = [
  { path: '', component: UploadBiometricAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadBiometricAttendanceMasterRoutingModule { }
