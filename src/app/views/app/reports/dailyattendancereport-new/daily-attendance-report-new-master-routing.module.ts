import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyattendancereportNewComponent } from './dailyattendancereport-new.component';


const routes: Routes = [
  { path: '', component: DailyattendancereportNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAttendanceReportNewMasterRoutingModule { }
