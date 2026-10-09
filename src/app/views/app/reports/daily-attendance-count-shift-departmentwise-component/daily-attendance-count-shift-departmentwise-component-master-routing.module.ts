import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyAttendanceCountShiftDepartmentwiseComponentComponent } from './daily-attendance-count-shift-departmentwise-component.component';


const routes: Routes = [
  { path: '', component: DailyAttendanceCountShiftDepartmentwiseComponentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAttendanceCountShiftDepartmentwiseComponentMasterRoutingModule { }
