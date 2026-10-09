import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOutsideAttendanceComponent } from './my-outside-attendance.component';


const routes: Routes = [
  { path: '', component: MyOutsideAttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutsideAttendanceMasterRoutingModule { }
