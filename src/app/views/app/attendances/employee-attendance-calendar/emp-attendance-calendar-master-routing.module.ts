import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeAttendanceCalendarComponent } from './employee-attendance-calendar.component';


const routes: Routes = [
  { path: '', component: EmployeeAttendanceCalendarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpAttendanceCalendarMasterRoutingModule { }
