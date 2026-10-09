import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidateShiftAttendanceComponent } from './validate-shift-attendance.component';


const routes: Routes = [
  { path: '', component: ValidateShiftAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidateShiftAttendanceMasterRoutingModule { }
