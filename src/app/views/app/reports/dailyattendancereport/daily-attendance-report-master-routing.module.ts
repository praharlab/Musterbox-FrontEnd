import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyattendancereportComponent } from './dailyattendancereport.component';


const routes: Routes = [
  { path: '', component: DailyattendancereportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAttendanceReportMasterRoutingModule { }
