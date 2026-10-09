import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyAttendanceCountDepartmentwiseComponent } from './daily-attendance-count-departmentwise/daily-attendance-count-departmentwise.component';


const routes: Routes = [
  { path: '', component: DailyAttendanceCountDepartmentwiseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAttendanceCountDepartmentwiseMasterRoutingModule { }
